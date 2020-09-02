import React, { useState, useEffect } from "react";
import { authService } from "../components/auth.service";
import { useSnackbar } from "notistack";
import InputForm from "../components/input-form";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { ILookupCall, IStockData, IUserHolding } from "../data/interfaces";
import { Urls } from "../data/constants";
import ApiCall from "../components/api-call";
import Trade from "../components/trade";

export default function Buy(props: any) {
  /* all we need to do is provide a textbox tied to state that gets a valid
   * stock symbol */

  let [stockInput, setStockInput] = useState("");
  let [validStock, setValidStock] = useState(false);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let [lookupData, setLookupData] = useState({} as IStockData);
  let [userShares, setUserShares] = useState<number>(0);
  let [validLookup, setValidLookup] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setStockInput(event.target.value);
  }

  async function handleBlur(event: React.ChangeEvent<HTMLInputElement>) {
    if (stockInput.length > 0 && validStock) {
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
        setValidLookup(false);
      } else {
         /* get holdings info if any */
       let result = authService.currentUserValue.userData.holdings.filter(
        (holding: IUserHolding) => {
          return holding.stock_symbol === lookupData.symbol;
        }
      ); 
        setUserShares( result && result[0] && result[0].shares && result[0].shares > 0 ? result[0].shares : 0);
        setLookupData(response);
        setValidLookup(true);
      }
    }
    return;
  }

  let bung = {
    stock_symbol: lookupData.symbol,
    stock_name: lookupData.companyName,
    shares: userShares,
    latestPrice: lookupData.latestPrice,
    type: "buy", 
  }

  return (
    <>
    <ValidatorForm onSubmit={() => {}}>
      <TextValidator
        name="stock_symbol"
        label="Stock Symbol"
        value={stockInput}
        onChange={handleChange}
        onBlur={handleBlur as any}
        validatorListener={setValidStock}
        variant="outlined"
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
      ></TextValidator>
    </ValidatorForm>

    {lookupData && validStock && validLookup && <Trade {...bung}/>}
    </>
  );
}
