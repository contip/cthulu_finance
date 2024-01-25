import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { ILookupCall, IStockData, ITradeProps } from "../data/interfaces";
import { Urls } from "../data/constants";
import { fetchCall } from "../components/helpers";
import Trade from "../components/trade";
import Title from "../components/title";

/* provides text input for user to enter stock name, checks validity of stock
 * symbol on blur, if valid shows trade form and allows user to make purchase */
export default function Buy() {
  let [stockInput, setStockInput] = useState("");
  let [validStock, setValidStock] = useState(false);
  let [lookupData, setLookupData] = useState({} as IStockData);
  let [validLookup, setValidLookup] = useState(false);
  let [lastSearched, setLastSearched] = useState("");
  let { enqueueSnackbar } = useSnackbar();

  /* sets state based on text input value */
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setStockInput(event.target.value);
  }

  /* if the value in text field has changed, then on blur does api call to
   * get latest price and sets state accordingly */
  async function handleBlur() {
    if (stockInput === lastSearched) {
      return;
    }
    setValidLookup(false); /* set invalid while searching */
    if (stockInput.length > 0 && validStock) {
      let payload: ILookupCall = {
        url: Urls.lookup,
        auth: true,
        body: {
          name: stockInput,
        },
      };
      let response = await fetchCall(payload);
      if (response.code) {
        /* if user blurs on invalid stock symbol and not found response given
         * by server, display snackbar indicating this and reset state */
        enqueueSnackbar(response.message, { variant: "info" });
        setLookupData({} as IStockData);
        setValidLookup(false);
      } else {
        setLookupData(response);
        setValidLookup(true);
        setLastSearched(response.symbol);
      }
    }
    return;
  }

  let tradeProps: ITradeProps = {
    stock_symbol: lookupData.symbol,
    stock_name: lookupData.shortName,
    latestPrice: lookupData.regularMarketPrice,
    type: "buy",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Title view="Buy" />
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
      {
        /* if user entered a valid stock and pricing information was gotten
         * successfully, display the trade component, otherwise empty space */
        lookupData && validStock && validLookup ? (
          <div style={{ textAlign: "center" }}>
            <Trade {...tradeProps} />
          </div>
        ) : (
          <span>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </span>
        )
      }
    </div>
  );
}
