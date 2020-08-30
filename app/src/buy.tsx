import React, { useState } from "react";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import SweetAlert from "react-bootstrap-sweetalert";
import { ITradeCall, ILookupCall } from "./interfaces";
import { Urls } from "./constants";
import ApiCall from "./api";
import InputForm from "./input-form";

export default function Buy(props: any) {
  let [stockInput, setStockInput] = useState<string>("");
  let [validStockInput, setValidStockInput] = useState<boolean>(true);
  let [sharesInput, setSharesInput] = useState<string>("");
  let [validSharesInput, setValidSharesInput] = useState<boolean>(true);
  let [confirm, setConfirm] = useState(false);
  let [lookupPrice, setLookupPrice] = useState(0);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let history = useHistory();

  async function handleConfirm() {
    let payload: ILookupCall = {
      url: Urls.lookup,
      auth: true,
      body: {
        name: stockInput,
      },
    };
    let response = await ApiCall(payload);
    if (response.code) {
      enqueueSnackbar(response.message, { variant: "error" });
      setStockInput("");
      setSharesInput("");
    } else if (authService.currentUserValue.userData.cash - (response.latestPrice * parseInt(sharesInput)) < 0) {
        enqueueSnackbar("Error: Not Enough Cash!", {variant: "error"})
      setStockInput("");
      setSharesInput("");
      } else {
      setLookupPrice(response.latestPrice);
    }
    setConfirm(true);
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
        {confirm && lookupPrice > 0 && (
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
            Buy {sharesInput} {parseInt(sharesInput) > 1 ? "shares" : "share"} of {stockInput} for $
            {(parseInt(sharesInput) * lookupPrice).toFixed(2)}???
          </SweetAlert>
        )}
      </div>
      <InputForm
        {...{
          onSubmit: handleConfirm,
          buttonValidators: [
            validStockInput,
            validSharesInput,
            parseInt(sharesInput) > 0,
            stockInput.length > 0,
          ],
          inputs: [
            {
              label: "Stock Symbol",
              value: stockInput,
              onChange: handleChange,
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
              ],
              errorMessages: [
                "this field is required!",
                "numerical digits only!",
                "maximum purchase amount: 99,999 shares!",
              ],
            },
          ],
        }}
      ></InputForm>
    </>
  );
}
