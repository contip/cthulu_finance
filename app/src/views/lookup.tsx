import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Table from "../components/table";
import { LookupColumnsMap, Urls } from "../data/constants";
import { IStockData, ILookupCall, IUserHolding } from "../data/interfaces";
import { useSnackbar } from "notistack";
import ApiCall from "../components/api-call";
import InputForm from "../components/input-form";
import { authService } from "../components/auth.service";
import Trade from "../components/trade";
import ShopTwo from "@material-ui/icons/ShopTwo";

export default function Lookup() {
  let [lookupInput, setLookupInput] = useState<string>("");
  let [validInput, setValidInput] = useState<boolean>(true);
  let [stockData, setStockData] = useState<IStockData>({} as IStockData);
  let [columnData, setColumnData] = useState<Array<any> | null>(null);
  let [didSearch, setDidSearch] = useState<boolean>(false);
  let [userShares, setUserShares] = useState<number>(0);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLookupInput(event.target.value);
    return;
  }
  let bung = {
    stock_symbol: stockData.symbol,
    stock_name: stockData.companyName,
    shares: userShares,
    latestPrice: stockData.latestPrice,
  }

  async function handleSubmit() {
    /* purge anything in stockData / columnData state before submission */
    setStockData({ companyName: "", symbol: "", latestPrice: NaN });
    setColumnData(null);
    let payload: ILookupCall = {
      url: Urls.lookup,
      auth: true,
      body: { name: lookupInput },
    };
    let response = await ApiCall(payload);
    if (response.code) {
      enqueueSnackbar(response.message, { variant: "error" });
      setLookupInput("");
      return;
    } else {
      let lookupData: any = {};
      Object.keys(LookupColumnsMap).forEach((element) => {
        if (response[element]) {
          if (element == "lowTime" || element == "highTime") {
            /* api sometimes includes min/max dates without the associated min/max
             * price.. in this case, discard the date */
            if (!response[element.substr(0, element.indexOf("T"))]) {
              delete response[element];
            } else {
              /* if both date and min/max present, make date into readable format */
              lookupData[element] = new Intl.DateTimeFormat("en-Us", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              }).format(response[element]);
            }
          } else {
            lookupData[element] = response[element];
          }
        }
      });
      setLookupInput("");
      /* get holdings info if any */
       let result = authService.currentUserValue.userData.holdings.filter(
      (holding: IUserHolding) => {
        return holding.stock_symbol === lookupData.symbol;
      }
    ); 
      setUserShares( result && result[0] && result[0].shares && result[0].shares > 0 ? result[0].shares : 0);
      setStockData(lookupData as IStockData);
      prepTableData(lookupData as IStockData);
      setDidSearch(true);
      return;
    }
  }

  function getHoldings(stock_symbol: string): void {
    console.log('getHOldings being called with', stock_symbol);
    let result = authService.currentUserValue.userData.holdings.filter(
      (holding: IUserHolding) => {
        return holding.stock_symbol === stock_symbol;
      }
    );
    console.log('result of using filter on the user holdings object', result)
    if (!result || !result[0].shares || result[0].shares === 0) {
      return;
    }
   setUserShares(result[0].shares); 
  }

  function prepTableData(response: IStockData): void {
    let tableCols: any = [];
    Object.keys(response).forEach((key) => {
      tableCols.push({ title: LookupColumnsMap[key], field: key });
      if (LookupColumnsMap[key].split(" ").slice(-1)[0] === "Price") {
        tableCols[tableCols.length - 1]["type"] = "currency";
      }
    });
    setColumnData(tableCols);
  }

  return (
    <>
      <InputForm
        {...{
          onSubmit: handleSubmit,
          buttonValidators: [validInput, lookupInput.length > 0],
          inputs: [
            {
              label: "Stock Symbol",
              value: lookupInput,
              onChange: handleChange,
              name: "name",
              validatorListener: setValidInput,
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
          ],
        }}
      ></InputForm>

      {didSearch &&
        stockData &&
        stockData.companyName &&
        columnData &&
        <div>
        {Table({
          tableCols: columnData,
          data: [stockData],
          detailPanel: [
            {
              icon: ShopTwo,
              tooltip: "Quick Trade",
              render: () => {
                return (
                  <div>
                  <Trade {...bung} />
                  </div>
                );
              },
            },
          ],
          title: `Quote Results for ${stockData.symbol}`,
          options: {
            paging: false,
            showSelectAllCheckbox: false,
            search: false,
            sorting: false,
          },
        })}
</div>
        // &&
        // <div>
        // <QuickTrade {...bung} />
        // </div>

        // <QuickTrade {...bung} />
        
        }
            {/* <>
    {didSearch && stockData && 
    <QuickTrade {...bung} />}
    </> */}
    </>

  );
}
