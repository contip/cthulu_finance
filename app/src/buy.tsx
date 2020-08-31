import React, { useState, useEffect } from "react";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import SweetAlert from "react-bootstrap-sweetalert";
import { ITradeCall, ILookupCall, IStockData } from "./interfaces";
import { Urls } from "./constants";
import ApiCall from "./api";
import InputForm from "./input-form";
import { ValidatorForm } from "react-material-ui-form-validator";

export default function Buy(props: any) {
  let [stockInput, setStockInput] = useState<string>("");
  let [validStockInput, setValidStockInput] = useState<boolean>(true);
  let [sharesInput, setSharesInput] = useState<string>("");
  let [validSharesInput, setValidSharesInput] = useState<boolean>(true);
  let [confirm, setConfirm] = useState(false);
  let [lookupData, setLookupData] = useState({} as IStockData);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let history = useHistory();

  //   useEffect(() => {
  //     if (blurring) {
  // }

  //     return () => {
  //       ValidatorForm.removeValidationRule('isLookupMatch');
  //     }
  //   }, [])
  function handleConfirm() {
    /* because of the way validator works, it's technically possible for
     * user to submit invalid requests by doing a valid blur, entering an
     * invalid symbol, and attempting to purchase before rerender...
     * therefore, need another lookup check */

    handleBlur().then(() => {
      if (lookupData.latestPrice > 0 && stockInput.toUpperCase() === lookupData.symbol) {
        setConfirm(true);
      }
    });
  }
  ValidatorForm.addValidationRule("maxPurchase", (value: any) => {
    if (
      parseInt(value) * lookupData.latestPrice >
      authService.currentUserValue.userData.cash
    ) {
      return false;
    }
    return true;
  });

  async function handleBlur(event?: React.ChangeEvent<HTMLInputElement> | any) {
    if (stockInput.length > 0) {
      let payload: ILookupCall = {
        url: Urls.lookup,
        auth: true,
        body: {
          name: stockInput,
        },
      };
      let response = await ApiCall(payload);
      if (response.code) {
        enqueueSnackbar(response.message, { variant: "info" });
        setLookupData({} as IStockData);
      } else {
        setLookupData(response);
      }
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name == "stock_symbol") {
      setStockInput(event.target.value);
    } else {
      setSharesInput(event.target.value);
    }
    return;
  }

  async function handleSubmit() {
    setConfirm(false);

    let payload: ITradeCall = {
      url: Urls.buy,
      auth: true,
      body: {
        user_id: authService.currentUserValue.userData.id,
        stock_symbol: stockInput,
        shares: parseInt(sharesInput),
      },
    };
    let response = await ApiCall(payload);
    if (response.code) {
      enqueueSnackbar(response.message, { variant: "error" });
      setStockInput("");
      setSharesInput("");
    } else {
      enqueueSnackbar("Purchase Successful!", {
        variant: "success",
        autoHideDuration: 4000,
      });
      history.push("/");
    }
  }

  function handleCloseAlert() {
    setConfirm(false);
    setSharesInput("");
    setStockInput("");
    enqueueSnackbar("Purchase Cancelled!", { variant: "info" });
  }

  return (
    <>
      <div>
        {confirm && (
          <SweetAlert
            warning
            showCancel
            onConfirm={handleSubmit}
            confirmBtnText="Purchase!"
            confirmBtnBsStyle="danger"
            title="Confirm Purchase"
            onCancel={handleCloseAlert}
            focusCancelBtn
          >
            Buy {sharesInput} {parseInt(sharesInput) > 1 ? "shares" : "share"}{" "}
            of {stockInput} for $
            {(parseInt(sharesInput) * lookupData.latestPrice).toFixed(2)}???
          </SweetAlert>
        )}
      </div>
      <InputForm
        {...{
          onSubmit: handleConfirm,
          buttonValidators: [
            validStockInput,
            validSharesInput,
            lookupData.companyName != undefined,
            parseInt(sharesInput) > 0,
            stockInput.length > 0,
          ],
          inputs: [
            {
              label: "Stock Symbol",
              value: stockInput,
              onChange: handleChange,
              onBlur: handleBlur as any,
              name: "stock_symbol",
              validatorListener: setValidStockInput,
              validators: [
                "required",
                "matchRegexp:^[A-Za-z]+$",
                "maxStringLength:4",
              ],
              errorMessages: [
                "this field is required!",
                "alphabetical letters only!",
                "stock symbols have a 4 character maximum!",
              ],
            },
            {
              label: "Shares",
              type: "Number",
              onChange: handleChange,
              name: "shares",
              validatorListener: setValidSharesInput,
              value: sharesInput,
              validators: [
                "required",
                "matchRegexp:^[0-9]+$",
                "maxStringLength:5",
                "maxPurchase",
              ],
              errorMessages: [
                "this field is required!",
                "numerical digits only!",
                "maximum purchase amount: 99,999 shares!",
                "price exceeds your current total cash!",
              ],
            },
          ],
        }}
      ></InputForm>
      <div id="PurchaseInfo">
        {lookupData.companyName &&
          `${
            lookupData.companyName
          } Trading Price: $${lookupData.latestPrice.toFixed(2)}`}
        <p />
        {parseInt(sharesInput) > 0 &&
          lookupData.latestPrice > 0 &&
          `Purchase Price: $${(
            parseInt(sharesInput) * lookupData.latestPrice
          ).toFixed(2)}`}
      </div>
    </>
  );
}
