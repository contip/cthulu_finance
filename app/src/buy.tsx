import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';

export default function Buy(props: any) {
  let [stockInput, setStockInput] = useState<string>("");
  let [validStockInput, setValidStockInput] = useState<boolean>(true);
  let [sharesInput, setSharesInput] = useState<string>("");
  let [validSharesInput, setValidSharesInput] = useState<boolean>(true);
  let [loading, setLoading] = useState<boolean>(false);
  let history = useHistory();
  let {enqueueSnackbar, closeSnackbar} = useSnackbar();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name == "stock_symbol") {
      setStockInput(event.target.value);
    } else {
      setSharesInput(event.target.value);
    }
    return;
  }

  async function handleSubmit() {
      setLoading(true);
    let response: any = await fetch("http://localhost:6969/trades/buy", {
      method: "POST",
      headers: await authService.authHeader(),
      body: JSON.stringify({
        user_id: authService.currentUserValue.userData.id,
        stock_symbol: stockInput,
        shares: sharesInput,
      }),
    });
        if (response.status == 400) {
            if (response.body.message = "Not Enough Cash!") {
            alert('purchase not made: not enough cash!');
            setSharesInput("");
            }
            else {
                alert('purchase not made: invalid stock symbol entered!')
                setStockInput("");
                setSharesInput("");
            }
            setLoading(false);
        }
        else if (response.status == 401) {
            alert('authentication error!  logging you out');
            authService.logout();
        }
        else if (response.status == 201) {
            enqueueSnackbar("bunghilda", {variant: "success", autoHideDuration: 4000})
            alert('purchase successful!');
            return history.push('/')
        }
        else {
            alert('error contacting server!  pls tried again');
            setStockInput("");
            setSharesInput("");
            
        }


  }

  return (
    <>
      <ValidatorForm
        onSubmit={handleSubmit}
        onError={(errors) => {
          console.log(errors);
        }}
      >
        <TextValidator
          label="Stock Symbol"
          onChange={handleChange}
          name="stock_symbol"
          validatorListener={setValidStockInput}
          value={stockInput}
          validators={[
            "required",
            "matchRegexp:^[A-Za-z]+$",
            "maxStringLength:4",
          ]}
          errorMessages={[
            "this field is required!",
            "alphabetical letters only!",
            "stock symbols have a 4 character maximum!",
          ]}
          variant="outlined"
        />
        <TextValidator
          label="Shares"
          type="Number"
          onChange={handleChange}
          name="shares"
          validatorListener={setValidSharesInput}
          value={sharesInput}
          validators={["required", "matchRegexp:^[0-9]+$", "maxStringLength:5"]}
          errorMessages={[
            "this field is required!",
            "numerical digits only!",
            "maximum purchase amount: 99,999 shares!",
          ]}
          variant="outlined"
        />
        {
          /* hide submit button unless text input is valid */
          validStockInput &&
            stockInput &&
            validSharesInput &&
            parseInt(sharesInput) > 0 && <Button type="submit">Submit</Button>
        }
      </ValidatorForm>
    </>
  );
}
