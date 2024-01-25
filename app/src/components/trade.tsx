import React, { useState, useEffect } from "react";
import { authService } from "./auth.service";
import { useHistory, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import SweetAlert from "react-bootstrap-sweetalert";
import { Urls } from "../data/constants";
import { fetchCall, numFormat } from "./helpers";
import InputForm from "./input-form";
import { ILookupCall, ITradeCall, ITradeProps } from "../data/interfaces";
import { ValidatorForm } from "react-material-ui-form-validator";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
    },
    quickTrade: {
      textAlign: "center",
    },
    tradeInfo: {
      fontFamily: "Chiller",
      fontSize: "x-large",
      color: theme.palette.secondary.main,
      fontWeight: "bold",
    },
    visible: {
      textAlign: "center",
      visibility: "visible",
    },
    hidden: {
      visibility: "hidden",
    },
    sums: {
      fontWeight: "bold",
      color: theme.palette.primary.main,
      display: "inline",
      fontFamily: "Chiller",
      fontSize: "x-large",
    },
  })
);

/* configurable quicktrade form, allowing user to buy or sell stocks */
export default function Trade(props: ITradeProps): JSX.Element {
  let [lookupPrice, setLookupPrice] = useState<number>(0);
  let [tradeType, setTradeType] = useState(props.type);
  let [sharesInput, setSharesInput] = useState<string>("");
  let [validSharesInput, setValidSharesInput] = useState<boolean>(false);
  let [confirm, setConfirm] = useState<boolean>(false);
  let { enqueueSnackbar } = useSnackbar();
  let history = useHistory();
  let location = useLocation();
  const classes = useStyles();

  /* if the trade type is buy, add max purchase validation rule to form */
  if (tradeType === "buy") {
    ValidatorForm.addValidationRule("maxPurchase", (value: any) => {
      if (
        parseInt(value) * lookupPrice >
        authService.currentUserValue.userData.cash
      ) {
        return false;
      }
      return true;
    });
  }

  /* prevent stale purchase/sale requests from "/" route by fetching latest
   * price data, otherwise use newly generated price data from passed props */
  useEffect(() => {
    if (location.pathname === "/") {
      let payload: ILookupCall = {
        url: Urls.lookup,
        auth: true,
        body: {
          name: props.stock_symbol,
        },
      };
      fetchCall(payload).then((response: any) => {
        if (response.code) {
          enqueueSnackbar(response.message, { variant: "error" });
          setLookupPrice(0);
        } else {
          setLookupPrice(response["optionChain"]["result"][0]["quote"]["regularMarketPrice"]);
        }
      });
    } else {
      setLookupPrice(props.latestPrice);
    }
  }, []);

  /* handles server api call to log the trade, then updates state with redirect;
   * reachable by user accepting the transaction confirmation popup */
  async function handleSubmit() {
    setConfirm(false); /* close the alert popup */
    let payload: ITradeCall = {
      url: tradeType === "buy" ? Urls.buy : Urls.sell,
      auth: true,
      body: {
        user_id: authService.currentUserValue.userData.id,
        stock_symbol: props.stock_symbol,
        shares: parseInt(sharesInput),
      },
    };
    let response = await fetchCall(payload);
    if (response.code) {
      enqueueSnackbar(response.message, { variant: "error" });
      setSharesInput("");
    } else {
      enqueueSnackbar(
        tradeType === "buy" ? "Purchase Successful!" : "Sale Successful!",
        {
          variant: "success",
        }
      );
      if (location.pathname === "/") {
        history.push("/redirect");
      } else {
        history.push("/");
      }
    }
    return;
  }

  /* if user declines confirmation, resets state and displays cancelled snack */
  function handleCancelAlert() {
    setConfirm(false);
    enqueueSnackbar(
      tradeType === "buy" ? "Purchase Cancelled!" : "Sale Cancelled!",
      { variant: "info" }
    );
    setSharesInput("");
    return;
  }

  function showConfirm() {
    setConfirm(true); /* displays (unhides) the alert popup */
    return;
  }

  /* sets state for shares input field (number of shares in trade), otherwise
   * sets overall Buy or Sell state if buy/sell radio button was triggered */
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "shares") {
      setSharesInput(event.target.value);
    } else {
      setTradeType(event.target.value);
      setSharesInput("");
      setValidSharesInput(false);
    }
    return;
  }

  return (
    <>
      {
        /* only display buy/sell radios if component accessed thru Table */
        /* triggers material ui warning about changing the uncontrolled
         * value state of radio button (bug) */
        (location.pathname === "/" || location.pathname === "/lookup") && (
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="tradeType"
              name="typeSelect"
              value={tradeType}
              onChange={handleChange}
              row
            >
              <FormControlLabel value="buy" control={<Radio />} label="Buy" />
              {/* hide sell button unless user owns shares of that stock */}
              <FormControlLabel
                className={
                  props.shares && props.shares > 0
                    ? classes.visible
                    : classes.hidden
                }
                value="sell"
                control={<Radio />}
                label="Sell"
              />
            </RadioGroup>
          </FormControl>
        )
      }
      {confirm /* if the confirm flag is true, display the alert popup */ && (
        <SweetAlert
          warning
          showCancel
          onConfirm={handleSubmit}
          confirmBtnText={tradeType === "buy" ? "Buy!" : "Sell!"}
          confirmBtnBsStyle="danger"
          title={tradeType === "buy" ? "Confirm Purchase" : "Confirm Sale"}
          onCancel={handleCancelAlert}
          focusConfirmBtn
        >
          {/* alert format example: Buy 10 shares of Company A for $100.69? */}
          {tradeType &&
            tradeType.charAt(0).toUpperCase() + tradeType.slice(1)}{" "}
          {sharesInput} {parseInt(sharesInput) > 1 ? "shares" : "share"} of{" "}
          {props.stock_name} for{" "}
          {numFormat(parseInt(sharesInput) * lookupPrice)}?
        </SweetAlert>
      )}
      <InputForm
        {...{
          onSubmit: showConfirm,
          buttonValidators: [
            lookupPrice > 0,
            validSharesInput,
            sharesInput !== "",
            parseInt(sharesInput) !== 0,
          ],
          inputs: [
            {
              label: "Shares",
              type: "Number",
              disabled:
                (location.pathname === "/" ||
                  location.pathname === "/lookup") &&
                !tradeType
                  ? true
                  : false,
              onChange: handleChange,
              name: "shares",
              validatorListener: setValidSharesInput,
              value: sharesInput as any /* casts number to string */,
              validators:
                tradeType === "buy"
                  ? [
                      "required",
                      "matchRegexp:^[0-9]+$",
                      "maxStringLength:5",
                      "maxPurchase" /* total cash */,
                    ]
                  : [
                      "required",
                      "matchRegexp:^[0-9]+$",
                      `maxNumber:${props.shares}` /* total shares */,
                    ],
              errorMessages:
                tradeType === "buy"
                  ? [
                      "this field is required!",
                      "numerical digits only!",
                      "maximum purchase amount: 99,999 shares!",
                      `you only have ${numFormat(
                        authService.currentUserValue.userData.cash
                      )}!`,
                    ]
                  : [
                      "this field is required!",
                      "numerical digits >= 1 only!",
                      `you only have ${props.shares} shares of 
                      ${props.stock_symbol} to sell!`,
                    ],
            },
          ],
        }}
      />
      {/* depending on location, display text showing price of currently "selected"
       * stock as well as summary of total proposed transaction amount */}
      <Grid container direction="column" className={classes.root}>
        {(location.pathname === "/buy" || location.pathname === "/sell") && (
          <Typography
            variant="body1"
            className={[
              lookupPrice > 0 ? classes.visible : classes.hidden,
              classes.tradeInfo,
            ].join(" ")}
          >
            {props.stock_name} ({props.stock_symbol}) current price:{" "}
            <Typography variant="body1" className={classes.sums}>
              {numFormat(lookupPrice)}
            </Typography>
          </Typography>
        )}
        <Typography
          variant="body1"
          className={[
            validSharesInput && sharesInput !== "" && sharesInput !== "0"
              ? classes.visible
              : classes.hidden,
            classes.tradeInfo,
          ].join(" ")}
        >
          {tradeType === "buy" ? "Purchase" : "Sale"} price:{" "}
          <Typography variant="body1" className={classes.sums}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(lookupPrice * parseInt(sharesInput))}
          </Typography>
        </Typography>
      </Grid>
    </>
  );
}
