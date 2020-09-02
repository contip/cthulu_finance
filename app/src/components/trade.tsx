import React, { useState, useEffect } from "react";
import { authService } from "./auth.service";
import { useHistory, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import SweetAlert from "react-bootstrap-sweetalert";
import { Urls } from "../data/constants";
import ApiCall from "./api-call";
import InputForm from "./input-form";
import { ILookupCall, ITradeCall } from "../data/interfaces";
import { ValidatorForm } from "react-material-ui-form-validator";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Typography } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
    quickTrade: {
      textAlign: "center", 
    },
    tradeInfo: {

    },
    visible: {
visibility: "visible"
    },
    hidden: {
visibility: "hidden"
    }
  }),
);
export default function Trade(rowData: any) {
  /* inline, single-field quicktrade form for users to buy/sell */
  /* we ALREADY KNOW that the given symbol from rowData is a valid stock
   * that is already owned by user, therefore we ONLY have to worry about
   * the dang price */
  let [lookupPrice, setLookupPrice] = useState<number>(0);
  let [tradeType, setTradeType] = useState(rowData.type);
  let [sharesInput, setSharesInput] = useState<string>("");
  let [validSharesInput, setValidSharesInput] = useState<boolean>(false);
  let [confirm, setConfirm] = useState(false);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let history = useHistory();
  let location = useLocation();
const classes = useStyles();

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
    // let mounted = true;
    if (location.pathname === "/") {
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
    });} else {
      setLookupPrice(rowData.latestPrice)

    }
    // return () => {
    //   // mounted = false;
    // };
  }, []);

  //TODO
  async function handleSubmit() {
    setConfirm(false);
    let payload: ITradeCall = {
      url: tradeType === "buy" ? Urls.buy : Urls.sell,
      auth: true,
      body: {
        user_id: authService.currentUserValue.userData.id,
        stock_symbol: rowData.stock_symbol,
        shares: parseInt(sharesInput),
      },
    };
    let response = await ApiCall(payload);
    if (response.code) {
      enqueueSnackbar(response.message, { variant: "error" });
      setSharesInput("");
    } else {
      enqueueSnackbar(
        tradeType === "buy" ? "Purchase Successful!" : "Sale Successful!",
        {
          variant: "success",
        }
      );
      if (location.pathname === "/") {
        history.push("/test")
      }
      else {
        history.push("/");
      }
      
    }

    return;
  }
  function handleCloseAlert() {
    setConfirm(false);
    enqueueSnackbar(
      tradeType === "buy" ? "Purchase Cancelled!" : "Sale Cancelled!",
      { variant: "info" }
    );
    setSharesInput("");
    return;
  }
  function handleConfirm() {
    setConfirm(true);

    return;
  }
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "shares") {
      // alertSystem({onConfirm: handleConfirm, confirmBtnText: "slit", title: "bung", onCancel: ()=>{}, message: "bunghilda"})
      setSharesInput(event.target.value);
    } else {
      setTradeType(event.target.value);
      setSharesInput("");
      setValidSharesInput(false);
    }
    return;
  }

  return (
    <>
    {(location.pathname === "/"  || location.pathname === "/lookup") &&
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="tradeType"
          name="typeSelect"
          value={tradeType}
          onChange={handleChange}
          row
        >
          <FormControlLabel value="buy" control={<Radio />} label="Buy" />
          {rowData.shares > 0 && 
          <FormControlLabel value="sell" control={<Radio />} label="Sell" />}
        </RadioGroup>
      </FormControl>}
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
          {tradeType.charAt(0).toUpperCase() + tradeType.slice(1)} {sharesInput}{" "}
          {parseInt(sharesInput) > 1 ? "shares" : "share"} of{" "}
          {rowData.stock_name} for $
          {(parseInt(sharesInput) * lookupPrice).toFixed(2)}???
        </SweetAlert>
      )}

      <InputForm
        {...{
          onSubmit: handleConfirm,
          buttonValidators: [
            lookupPrice > 0,
            validSharesInput,
            sharesInput !== "",
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

      <div id="tradeInfo">
      {(location.pathname === "/buy" || location.pathname === "/sell") && <Typography
        variant="subtitle1"
        className={classes.tradeInfo}>
          {rowData.stock_name} ({rowData.stock_symbol}) current price: $
          {lookupPrice.toFixed(2)}
      </Typography> }
        <Typography
        variant="subtitle1"
        className={validSharesInput &&
          sharesInput !== "" &&
          sharesInput !== "0" ? classes.visible : classes.hidden}
          
         > 
            {tradeType === "buy" ? "Purchase" : "Sale"} price: {
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format
              (
              lookupPrice * parseInt(sharesInput)
            )}
            </Typography>
      </div>
    </>
  );
}
