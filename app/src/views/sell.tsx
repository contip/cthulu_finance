import React, { useState } from "react";
import {
  IStockData,
  ILookupCall,
  IUserData,
  IUserHolding,
  ITradeProps,
} from "../data/interfaces";
import { useSnackbar } from "notistack";
import { Urls } from "../data/constants";
import { fetchCall } from "../components/helpers";
import { authService } from "../components/auth.service";
import Trade from "../components/trade";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Title from "../components/title";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    visible: {
      visibility: "visible",
    },
    hidden: {
      visibility: "hidden",
    },
  })
);

/* allows user to sell any of the stocks they currently possess */
export default function Sell(): JSX.Element {
  let [select, setSelect] = useState<string>("");
  let [lookupData, setLookupData] = useState({} as IStockData);
  let [userShares, setUserShares] = useState<number>(0);
  let [validLookup, setValidLookup] = useState(false);
  let { enqueueSnackbar } = useSnackbar();
  let classes = useStyles();
  let userData: IUserData = authService.currentUserValue.userData;

  /* creates a select option for each stock the user owns */
  function selectMenuOptions(): Array<JSX.Element> {
    let items: JSX.Element[] = [];
    if (userData.holdings.length > 0) {
      for (let i = 0; i < userData.holdings.length; i++) {
        items.push(
          <MenuItem
            key={userData.holdings[i].stock_symbol}
            value={userData.holdings[i].stock_symbol}
          >
            {userData.holdings[i].stock_symbol} -{" "}
            {userData.holdings[i].stock_name}
          </MenuItem>
        );
      }
    }
    return items;
  }

  /* fetches latest stock data when user changes select option */
  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelect(event.target.value);
    if (event.target.value !== "") {
      let payload: ILookupCall = {
        url: Urls.lookup,
        auth: true,
        body: {
          name: event.target.value /* can't be invalid */,
        },
      };
      let response = await fetchCall(payload);
      if (response.code) {
        enqueueSnackbar(response.message, { variant: "info" });
        setLookupData({} as IStockData);
        setValidLookup(false);
      } else {
        setLookupData(response);
        /* get holdings info if any and set user shares */
        let result = userData.holdings.filter((holding: IUserHolding) => {
          return holding.stock_symbol === event.target.value;
        });
        setUserShares(
          result && result[0] && result[0].shares && result[0].shares > 0
            ? result[0].shares
            : 0
        );
        setValidLookup(true);
      }
    } else {
      setValidLookup(false);
      return;
    }
    return;
  }

  let tradeProps: ITradeProps = {
    stock_symbol: lookupData.symbol,
    stock_name: lookupData.companyName,
    shares: userShares,
    latestPrice: lookupData.latestPrice,
    type: "sell",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Title view="Sell" />
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="stock-name-select">Select Stock</InputLabel>
        <Select value={select} onChange={handleChange as any} label="Stock">
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {selectMenuOptions()}
        </Select>
      </FormControl>

      {validLookup && lookupData && select !== "" ? (
        <Trade {...tradeProps} />
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
      )}
    </div>
  );
}
