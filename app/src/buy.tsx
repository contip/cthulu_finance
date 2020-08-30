import React, { useState } from "react";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import SweetAlert from "react-bootstrap-sweetalert";
import { ITradeCall } from "./interfaces";
import { Urls } from "./constants";
import ApiCall from "./api";
import InputForm from "./input-form";

export default function Buy(props: any) {
  let [stockInput, setStockInput] = useState<string>("");
  let [validStockInput, setValidStockInput] = useState<boolean>(true);
  let [sharesInput, setSharesInput] = useState<string>("");
  let [validSharesInput, setValidSharesInput] = useState<boolean>(true);
  let [confirm, setConfirm] = useState(false);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let history = useHistory();

  function handleConfirm() {
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
    /* first, bring up the confirm dialog */
    // AlertDialog({title: "really do this?", description: "bung?", handleClose, buttonTitles: {accept: "yes", decline: "no"}} )
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
      enqueueSnackbar("bunghilda", {
        variant: "success",
        autoHideDuration: 4000,
      });
      alert("purchase successful!");
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
            confirmBtnText="Buy the thing"
            confirmBtnBsStyle="danger"
            title="Is your ass certain?"
            onCancel={handleCloseAlert}
            focusCancelBtn
          >
            Does your ass want to buy 69 shares of BUNG for $59.59???? lol
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
