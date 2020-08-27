import React, { useState } from "react";
import { Button } from "@material-ui/core";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import { IUserData, IUserHolding } from "./interfaces";

export default function Sell(props: any) {
  let [numShares, setNumShares] = useState<number>(0);
  let [select, setSelect] = useState<string>("");
  let [validShares, setValidShares] = useState<boolean>(true);
  let [loading, setLoading] = useState<boolean>(false);
  let history = useHistory();

  let userData: IUserData = authService.currentUserValue.userData;

  async function handleSubmit() {
    setLoading(true);

    let response: any = await fetch("http://localhost:6969/trades/sell", {
      method: "POST",
      headers: await authService.authHeader(),
      body: JSON.stringify({
        user_id: authService.currentUserValue.userData.id,
        stock_symbol: select,
        shares: numShares,
      }),
    });
    if (response.status == 400) {
      alert("sale not made!  not enough stocks!!");
      setNumShares(0);
      setSelect("");
      setLoading(false);
    } else if (response.status == 401) {
      alert("authentication error!  logging you out");
      authService.logout();
    } else if (response.status == 201) {
      alert("sale successful!");
      history.push("/");
    } else {
      alert("error contacting server!  pls tried again");
      setNumShares(0);
      setSelect("");
      setLoading(false);
    }
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

  if (loading) {
    return <h1>tp is loading for your bunghole</h1>;
  }
  return (
    <>
      <ValidatorForm
        onSubmit={handleSubmit}
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
