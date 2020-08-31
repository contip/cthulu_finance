import React, { useState, useEffect } from "react";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import SweetAlert from "react-bootstrap-sweetalert";
import { Urls } from "./constants";
import ApiCall from "./api";
import InputForm from "./input-form";
import { ILookupCall } from "./interfaces";
import { ValidatorForm } from "react-material-ui-form-validator";
import Alert from "./alert";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function QuickTrade(rowData: any) {
  /* inline, single-field quicktrade form for users to buy/sell */
  /* we ALREADY KNOW that the given symbol from rowData is a valid stock
   * that is already owned by user, therefore we ONLY have to worry about
   * the dang price */
  let [lookupPrice, setLookupPrice] = useState<number>(0);
  let [tradeType, setTradeType] = useState("buy");
  let [sharesInput, setSharesInput] = useState<string>("");
  let [validSharesInput, setValidSharesInput] = useState<boolean>(false);
  let [confirm, setConfirm] = useState(false);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let history = useHistory();

  // let alertSystem = rowData.alert;

  if (tradeType === "buy") {
    ValidatorForm.addValidationRule("maxPurchase", (value: any) => {
      if (
        parseInt(value) * lookupPrice >
        authService.currentUserValue.userData.cash
      ) {
        return false;
      }
      return true;
    });
  }

  /* prevent stale purchase / sale requests by always fetching latest price */
  useEffect(() => {
    let mounted = true;
    let payload: ILookupCall = {
      url: Urls.lookup,
      auth: true,
      body: {
        name: rowData.stock_symbol,
      },
    };
    ApiCall(payload).then((response: any) => {
      if (response.code) {
        enqueueSnackbar(response.message, { variant: "error" });
        setLookupPrice(0);
      } else {
        setLookupPrice(response.latestPrice);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  //TODO
  function handleSubmit() {
    return;
  }
  function handleCloseAlert() {
    setConfirm(false);
    enqueueSnackbar(
      tradeType === "buy" ? "Purchase Cancelled!" : "Sale Cancelled!",
      { variant: "info" }
    );
    return;
  }
  function handleConfirm() {
    enqueueSnackbar(
      tradeType === "buy" ? "Purchase Cancelled!" : "Sale Cancelled!",
      { variant: "info" }
    );
    alert('bung')
    setConfirm(true);

    return;
  }
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "shares"){
    
  // alertSystem({onConfirm: handleConfirm, confirmBtnText: "slit", title: "bung", onCancel: ()=>{}, message: "bunghilda"})
    setSharesInput(event.target.value);
    } else {
      setTradeType(event.target.value);
      setSharesInput("");
    }
    return;
  }

  return (
    <>

        <FormControl component="fieldset">
      <FormLabel component="legend">QuickTrade</FormLabel>
      <RadioGroup aria-label="tradeType" name="typeSelect" value={tradeType} onChange={handleChange}>
        <FormControlLabel value="buy" control={<Radio />} label="Buy" /><FormControlLabel value="sell" control={<Radio />} label="Sell" />
      </RadioGroup>
    </FormControl>
      {confirm && (
        <SweetAlert
          warning
          showCancel
          onConfirm={handleSubmit}
          confirmBtnText={tradeType === "buy" ? "Buy!" : "Sell!"}
          confirmBtnBsStyle="danger"
          title={tradeType === "buy" ? "Confirm Purchase" : "Confirm Sale"}
          onCancel={handleCloseAlert}
          focusCancelBtn
        >
          {tradeType.charAt(0).toUpperCase() + tradeType.slice(1)}{" "}
          {sharesInput} {parseInt(sharesInput) > 1 ? "shares" : "share"} of{" "}
          {rowData.stock_name} for $
          {(parseInt(sharesInput) * lookupPrice).toFixed(2)}???
        </SweetAlert>
      )}
      <h1>{rowData.stock_symbol}</h1>
      <h2>{lookupPrice}</h2>
      {/* {alertSystem({onConfirm: ()=>{}, confirmBtnText: "CORNHOLIO", title: "bung", onCancel: handleCloseAlert, message: "bunghilda"})} */}
      <h5>{tradeType}</h5>
      <InputForm
        {...{
          onSubmit: handleConfirm,
          buttonValidators: [
            lookupPrice > 0,
            validSharesInput,
            parseInt(sharesInput) !== 0,
          ],
          inputs: [
            {
              label: "Shares",
              type: "Number",
              onChange: handleChange,
              name: "shares",
              validatorListener: setValidSharesInput,
              value: sharesInput as any,
              validators:
                tradeType === "buy"
                  ? [
                      "required",
                      "matchRegexp:^[0-9]+$",
                      "maxStringLength:5",
                      "maxPurchase",
                    ]
                  : [
                      "required",
                      "matchRegexp:^[0-9]+$",
                      `maxNumber:${rowData.shares}`,
                    ],
              errorMessages:
                tradeType === "buy"
                  ? [
                      "this field is required!",
                      "numerical digits only!",
                      "maximum purchase amount: 99,999 shares!",
                      `invalid!  you only have $${authService.currentUserValue.userData.cash.toFixed(
                        2
                      )}!`,
                    ]
                  : [
                      "this field is required!",
                      "numerical digits >= 1 only!",
                      `invalid! you only have ${rowData.shares} shares of ${rowData.stock_symbol} to sell!`,
                    ],
            },
          ],
        }}
      />
    </>
  );
}
