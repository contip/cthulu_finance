import React, { useState } from "react";
import LookupApi, { stockData } from "./lookup-api";
import { Button } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Table, { tableCol } from "./table";
import { LookupColumnsMap } from "./constants";

export default function Lookup() {
  let [lookupInput, setLookupInput] = useState<string>("");
  let [validInput, setValidInput] = useState<boolean>(true);
  let [changed, setChanged] = useState<boolean>(false);
  let [stockData, setStockData] = useState<stockData>({
    companyName: "",
    symbol: "",
    latestPrice: NaN,
  });
  let [columnData, setColumnData] = useState<Array<any> | null>(null);
  let [didSearch, setDidSearch] = useState<boolean>(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setChanged(true);
    setLookupInput(event.target.value);
    return;
  }

  async function handleSubmit(): Promise<void | null> {
    /* purge anything in stockData / columnData state before submission */
    setStockData({ companyName: "", symbol: "", latestPrice: NaN });
    setColumnData(null);
    let response = await LookupApi(lookupInput);
    if (!response) {
      alert(`Error retrieving stock quote!  Are you sure ${lookupInput}
        is a valid stock symbol?`);
      return null;
    }
    console.log("setting stock data in lookup state to:", response);
    setLookupInput("");
    setStockData(response);
    // buildColumnNames();
    prepTableData(response);
    setDidSearch(true);
    return;
  }

  function prepTableData(response: stockData): void {
    let tableCols: Array<tableCol> = [];
    Object.keys(response).forEach((key) => {
      console.log("currently processing key:", key);
      tableCols.push({ title: LookupColumnsMap[key], field: key });
    });
    setColumnData(tableCols);
  }

  return (
    <>
      <p />
      <ValidatorForm
        onSubmit={handleSubmit} // only submits when all validations are passed
        onError={(errors) => {
          console.log(errors);
        }}
      >
        <TextValidator
          label="Stock Symbol"
          onChange={handleChange}
          name="name" // server expects request in form "name": "<val>"
          validatorListener={setValidInput} // if input is currently invalid and displaying error message, set invalid state
          value={lookupInput}
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

        {
          /* hide submit button unless text input is valid */
          changed && validInput && <Button type="submit">Submit</Button>
        }
      </ValidatorForm>
      {didSearch &&
        stockData &&
        stockData.companyName &&
        columnData &&
        Table(
          columnData,
          [stockData],
          `Quote Results for ${stockData.symbol}`,
          {
            paging: false,
            showSelectAllCheckbox: false,
            search: false,
            sorting: false,
          }
        )}
    </>
  );
}
