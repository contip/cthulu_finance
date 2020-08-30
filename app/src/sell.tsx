import React, { useState } from "react";
import { Button } from "@material-ui/core";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import { IUserData, IUserHolding, ITradeCall } from "./interfaces";
import { Urls } from "./constants";
import ApiCall from "./api";
import SweetAlert from "react-bootstrap-sweetalert";
import { useSnackbar } from "notistack";

export default function Sell(props: any) {
  let [numShares, setNumShares] = useState<number>(0);
  let [select, setSelect] = useState<string>("");
  let [validShares, setValidShares] = useState<boolean>(true);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let [confirm, setConfirm] = useState(false);
  let history = useHistory();

  let userData: IUserData = authService.currentUserValue.userData;
  function handleConfirm() {
    setConfirm(true);
  }
  async function handleSubmit() {
    setConfirm(false);
    let payload: ITradeCall = {
      url: Urls.sell,
      auth: true,
      body: {
        user_id: authService.currentUserValue.userData.id,
        stock_symbol: select,
        shares: numShares,
      },
    };
    let response = await ApiCall(payload);
    if (response.code) {
      enqueueSnackbar(response.message, { variant: "error" });
      setSelect("");
      setNumShares(0);
    } else {
      enqueueSnackbar("well, bunghilda, it was a success", {
        variant: "success",
      });
      history.push("/");
    }
  }

  function handleCloseAlert() {
    setConfirm(false);
    setSelect("");
    setNumShares(0);
    enqueueSnackbar("Sale Cancelled!", { variant: "info" });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name == "stock_symbol") {
      setSelect(event.target.value);
      setNumShares(0);
    } else {
      setNumShares(parseInt(event.target.value));
    }
  }

  function selectMenuOptions() {
    let items = [];
    if (userData.holdings.length > 0) {
      for (let i = 0; i < userData.holdings.length; i++) {
        items.push(
          <option value={userData.holdings[i].stock_symbol}>
            {userData.holdings[i].stock_symbol} -{" "}
            {userData.holdings[i].stock_name}
          </option>
        );
      }
    }
    return items;
  }

  function getMaxShares() {
    if (select) {
      return userData.holdings.filter((holding: IUserHolding) => {
        return holding.stock_symbol == select;
      })[0].shares;
    }
    return 0;
  }

  // if (loading) {
  //   return <h1>tp is loading for your bunghole</h1>;
  // }
  return (
    <>
          <div>
        {confirm && (
          <SweetAlert
            warning
            showCancel
            onConfirm={handleSubmit}
            confirmBtnText="SELL THE THING"
            confirmBtnBsStyle="danger"
            title="Is your ass for sure?"
            onCancel={handleCloseAlert}
            focusCancelBtn
          >
            Does your ass want to sell 69 shares of BUNG for $59.59???? lol
          </SweetAlert>
        )}
      </div>
      <ValidatorForm
        onSubmit={handleConfirm}
        onError={(errors) => {
          console.log(errors);
        }}
      >
        <SelectValidator
          name="stock_symbol"
          value={select}
          onChange={handleChange}
          validators={["required"]}
        >
          <option value="">Select</option>
          {selectMenuOptions()}
        </SelectValidator>

        {/* i can make these text validator boxes a reusable component... */}
        {select && (
          <TextValidator
            label="Shares"
            type="Number"
            onChange={handleChange}
            name="shares"
            validatorListener={setValidShares}
            value={numShares}
            validators={[
              "required",
              "matchRegexp:^[0-9]+$",
              `maxNumber:${getMaxShares()}`,
            ]}
            errorMessages={[
              "this field is required!",
              "numerical digits >= 1 only!",
              `invalid! you only have ${getMaxShares()} shares of ${select} to sell!`,
            ]}
            variant="outlined"
          />
        )}

        {numShares > 0 && validShares && <Button type="submit">Submit</Button>}
      </ValidatorForm>
    </>
  );
}
