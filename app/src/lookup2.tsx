import React, { useState, useEffect, FormEvent } from "react";
import LookupApi2, { stockData } from "./lookup-api2";
import { TextField, Button } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Table, { tableCol } from "./table";

export default function Lookup2() {
  let [lookupInput, setLookupInput] = useState<string>("");
  let [validInput, setValidInput] = useState<boolean>(true);
  let [changed, setChanged] = useState<boolean>(false);
  let [stockData, setStockData] = useState<stockData | null>(null);
  let [columnData, setColumnData] = useState<Array<any> | null>(null);
  let [didSearch, setDidSearch] = useState<boolean>(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setChanged(true);
    setLookupInput(event.target.value);
    return;
  }

  //   function textInput() {
  //       return(

  //       )
  //   }
  async function handleSubmit(
    event: React.FormEvent<Element>
  ): Promise<void | null> {
    let response = await LookupApi2(lookupInput);
    if (!response) {
      alert(`Error retrieving stock quote!  Are you sure ${lookupInput}
        is a valid stock symbol?`);
      return null;
    }
    console.log(response);
    /* convert the Date objects to strings before setting state */
    /* this is really bad */

    setStockData(response);
    buildColumnNames();
    setDidSearch(true);
    return;
  }

  function buildColumnNames(): void {
    let tableCols: Array<tableCol> = [];
    const colTitles: Array<string> = [
      "Company Name",
      "Trade Symbol",
      "Current Price",
      "Previous Closing Price",
      "Recent Min Price",
      "Date of Min",
      "Recent Max Price",
      "Date of Max",
      "Yearly Low",
      "Yearly High",
    ];
    const fieldTitles: Array<string> = [
      "companyName",
      "symbol",
      "latestPrice",
      "previousClose",
      "low",
      "lowTime",
      "high",
      "highTime",
      "week52Low",
      "week52High",
    ];
    for (let i = 0; i < fieldTitles.length; i++) {
      tableCols.push({ title: colTitles[i], field: fieldTitles[i] });
    }
    setColumnData(tableCols);

    return;
  }

  function displayStockTable(res: stockData) {}

  return (
    <>
      <p />
      <ValidatorForm
        //ref="form"
        onSubmit={handleSubmit} // only submits when all validations are passed
        onError={(errors) => {
          console.log(errors);
          //setValidInput(false);
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
        columnData &&
        Table(columnData, [stockData], "bunghilda", {
          paging: false,
          showSelectAllCheckbox: false,
          search: false,
          sorting: false,
        })}
    </>
  );
}
