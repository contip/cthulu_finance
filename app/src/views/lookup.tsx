import React, { useState } from "react";
import Table from "../components/table";
import { LookupColumnsMap, Urls } from "../data/constants";
import {
  IStockData,
  ILookupCall,
  IUserHolding,
  ITradeProps,
} from "../data/interfaces";
import { useSnackbar } from "notistack";
import { fetchCall } from "../components/helpers";
import InputForm from "../components/input-form";
import { authService } from "../components/auth.service";
import Trade from "../components/trade";
import ShopTwo from "@material-ui/icons/ShopTwo";
import Title from "../components/title";
import { makeStyles, Theme, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    visible: {
      visibility: "visible",
    },
    hidden: {
      visibility: "hidden",
    },
  })
);

/* allows user to lookup stocks by symbol, if found, displays table with data
 * from api; table provides quickbuy/sell functionality */
export default function Lookup() {
  let [lookupInput, setLookupInput] = useState<string>("");
  let [validInput, setValidInput] = useState<boolean>(true);
  let [stockData, setStockData] = useState<IStockData>({} as IStockData);
  let [columnData, setColumnData] = useState<Array<any> | null>(null);
  let [didSearch, setDidSearch] = useState<boolean>(false);
  let [userShares, setUserShares] = useState<number>(0);
  let { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLookupInput(event.target.value);
    return;
  }

  /* carries out fetch request to server for stock lookup data */
  async function handleSubmit() {
    /* purge anything in stockData / columnData state before submission */
    setStockData({ companyName: "", symbol: "", latestPrice: 0 });
    setColumnData(null);
    let payload: ILookupCall = {
      url: Urls.lookup,
      auth: true,
      body: { name: lookupInput },
    };
    let response = await fetchCall(payload);
    if (response.code) {
      enqueueSnackbar(response.message, { variant: "error" });
      setLookupInput("");
      return;
    } else {
      let lookupData: any = {};
      Object.keys(LookupColumnsMap).forEach((element) => {
        if (response[element]) {
          lookupData[element] = response[element];
        }
      });
      setLookupInput("");
      /* see if user owns any of that stock already (to give sell option) */
      let result = authService.currentUserValue.userData.holdings.filter(
        (holding: IUserHolding) => {
          return holding.stock_symbol === lookupData.symbol;
        }
      );
      /* filter function returns array of 1 object (the holding associated with
       * the stock being looked up), or empty array if user has no shares */
      setUserShares(
        result && result[0] && result[0].shares && result[0].shares > 0
          ? result[0].shares
          : 0 /* set to 0 if empty array to indicate user has no shares */
      );
      /* recast builder object to correct datatype and set state */
      setStockData(lookupData as IStockData);
      prepTableData(lookupData as IStockData);
      setDidSearch(true);
      return;
    }
  }

  /* prepares column parameters for the table, based on whether all fields were
   * included in the fetch response or not */
  function prepTableData(response: IStockData): void {
    let tableCols: any = [];
    Object.keys(response).forEach((key) => {
      tableCols.push({ title: LookupColumnsMap[key], field: key });
      if (LookupColumnsMap[key].split(" ").slice(-1)[0] === "Price") {
        tableCols[tableCols.length - 1]["type"] = "currency";
      }
    });
    tableCols.forEach((col: any) => {
      col["width"] = 350;
    });
    setColumnData(tableCols);
  }

  let tradeProps: ITradeProps = {
    stock_symbol: stockData.symbol,
    stock_name: stockData.companyName,
    shares: userShares,
    type: "buy",
    latestPrice: stockData.latestPrice,
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Title view="Lookup" />
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

      <div
        className={
          didSearch && stockData && stockData.companyName && columnData
            ? classes.visible
            : classes.hidden
        }
      >
        {Table({
          tableCols: columnData ?? undefined,
          data: [stockData] ?? null,
          detailPanel: [
            {
              icon: ShopTwo,
              tooltip: "Quick Trade",
              render: () => {
                return (
                  <div style={{ textAlign: "center" }}>
                    <Trade {...(tradeProps) ?? null} />
                  </div>
                );
              },
            },
          ],
          title: `Quote Results for ${stockData?.symbol}`,
          options: {
            paging: false,
            showSelectAllCheckbox: false,
            search: false,
            sorting: false,
          },
        })}
      </div>
      <span
        className={
          !didSearch || !stockData || !stockData.companyName || !columnData
            ? classes.visible
            : classes.hidden
        }
      >
        <br />
        <br />
        <br />
        <br />
        <br />
      </span>
    </div>
  );
}
