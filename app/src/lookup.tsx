import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Table, { tableCol } from "./table";
import { LookupColumnsMap, Urls } from "./constants";
import { IStockData, ILookupCall } from "./interfaces";
import { useSnackbar } from "notistack";
import ApiCall from "./api";

export default function Lookup() {
  let [lookupInput, setLookupInput] = useState<string>("");
  let [validInput, setValidInput] = useState<boolean>(true);
  let [stockData, setStockData] = useState<IStockData>({
    companyName: "",
    symbol: "",
    latestPrice: NaN,
  });
  let [columnData, setColumnData] = useState<Array<any> | null>(null);
  let [didSearch, setDidSearch] = useState<boolean>(false);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLookupInput(event.target.value);
    return;
  }

  // async function handleSubmit(): Promise<void | null> {
  //   /* purge anything in stockData / columnData state before submission */
  //   setStockData({ companyName: "", symbol: "", latestPrice: NaN });
  //   setColumnData(null);
  //   let response = await LookupApi(lookupInput);
  //   if (response.code) {
  //     enqueueSnackbar(response.message, { variant: "error" });
  //     setLookupInput("");
  //   }
  //   console.log("setting stock data in lookup state to:", response);
  //   setLookupInput("");
  //   setStockData(response);
  //   // buildColumnNames();
  //   prepTableData(response);
  //   setDidSearch(true);
  //   return;
  // }

  async function handleSubmit() {
    /* purge anything in stockData / columnData state before submission */
    setStockData({ companyName: "", symbol: "", latestPrice: NaN });
    setColumnData(null);
    let payload: ILookupCall = {url: Urls.lookup, auth: true, body: {name: lookupInput}};
    let response = await ApiCall(payload);
    if (response.code) {
      enqueueSnackbar(response.message, { variant: "error" });
      setLookupInput("");
    } else {
      let bunghilda: any = {};
      Object.keys(LookupColumnsMap).forEach((element) => {
        if (response[element]) {
          if (element == "lowTime" || element == "highTime") {
            /* api sometimes includes min/max dates without the associated min/max
             * price.. in this case, discard the date */
            if (!response[element.substr(0, element.indexOf("T"))]) {
              delete response[element];
            } else {
              /* if both date and min/max present, make date into readable format */
              bunghilda[element] = new Intl.DateTimeFormat("en-Us", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              }).format(response[element]);
            }
          } else {
            bunghilda[element] = response[element];
          }
        }
      });

    setLookupInput("");
    setStockData(bunghilda as IStockData);
    // buildColumnNames();
    prepTableData(bunghilda as IStockData);
    setDidSearch(true);
    return;}
  }




  function prepTableData(response: IStockData): void {
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
          validInput && lookupInput.length > 0 && <Button type="submit">Submit</Button>
        }
      </ValidatorForm>
      {didSearch &&
        stockData &&
        stockData.companyName &&
        columnData &&
        Table({tableCols: columnData, data: [stockData], title: `Quote Results for ${stockData.symbol}`, options:
          {
            paging: false,
            showSelectAllCheckbox: false,
            search: false,
            sorting: false,
          }}
        )}
    </>
  );
}
