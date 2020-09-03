import React, { useState, useEffect } from "react";
import { authService } from "./auth.service";
import { useHistory, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import SweetAlert from "react-bootstrap-sweetalert";
import { Urls } from "../data/constants";
import { fetchCall, numFormat } from "./helpers";
import InputForm from "./input-form";
import { ILookupCall, ITradeCall } from "../data/interfaces";
import { ValidatorForm } from "react-material-ui-form-validator";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { Typography } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
    quickTrade: {
      textAlign: "center",
    },
    tradeInfo: {},
    visible: {
      textAlign: "center",
      visibility: "visible",
    },
    hidden: {
      visibility: "hidden",
    },
  })
);

/* single-field configurable quicktrade form, allowing user to buy or sell */
export default function Trade(rowData: any) {
  let [lookupPrice, setLookupPrice] = useState<number>(0);
  let [tradeType, setTradeType] = useState(rowData.type);
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

  /* prevent stale purchase/sale requests from "/" (home) route by fetching
   * latest price data, otherwise use price data from passed props */
  useEffect(() => {
    if (location.pathname === "/") {
      let payload: ILookupCall = {
        url: Urls.lookup,
        auth: true,
        body: {
          name: rowData.stock_symbol,
        },
      };
      fetchCall(payload).then((response: any) => {
        if (response.code) {
          enqueueSnackbar(response.message, { variant: "error" });
          setLookupPrice(0);
        } else {
          setLookupPrice(response.latestPrice);
        }
      });
    } else {
      setLookupPrice(rowData.latestPrice);
    }
  }, []);

  /* reachable by user accepting the transaction alert popup; handles
   * server api call to log the trade, then updates with a redirect */
  async function handleSubmit() {
    setConfirm(false); /* close the alert popup */
    let payload: ITradeCall = {
      url: tradeType === "buy" ? Urls.buy : Urls.sell,
      auth: true,
      body: {
        user_id: authService.currentUserValue.userData.id,
        stock_symbol: rowData.stock_symbol,
        shares: parseInt(sharesInput),
      },
    };
    let response = await fetchCall(payload);
    if (response.code) {
      /* error codes from server requests should be unreachable due to validity
       * checks, but if received, display as a snackbar and reset state*/
      enqueueSnackbar(response.message, { variant: "error" });
      setSharesInput("");
    } else {
      enqueueSnackbar(
        /* display the appropriate success snackbar */
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

  /* if user does not accept confirmation alert, display a cancelled snackbar
   * and reset the state */
  function handleCancelAlert() {
    setConfirm(false);
    enqueueSnackbar(
      tradeType === "buy" ? "Purchase Cancelled!" : "Sale Cancelled!",
      { variant: "info" }
    );
    setSharesInput("");
    return;
  }

  /* sets flag to enable displaying the confirmation alert popup */
  function showConfirm() {
    setConfirm(true);
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
        /* only display buy / sell selection buttons if component is being
         * accessed from portfolio or lookup Tables (i.e. quicktrade) */
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
              {
                /* furthermore, only display the sell radio button if being
                 * accessed from the lookup table AND the user has shares of
                 * that stock */
                rowData.shares > 0 && (
                  <FormControlLabel
                    value="sell"
                    control={<Radio />}
                    label="Sell"
                  />
                )
              }
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
          {tradeType.charAt(0).toUpperCase() + tradeType.slice(1)}{" "}
          {sharesInput} {parseInt(sharesInput) > 1 ? "shares" : "share"} of
          {" "}{rowData.stock_name} for{" "}
          {numFormat(parseInt(sharesInput) * lookupPrice)}?
        </SweetAlert>
      )}

      <InputForm
        {...{
          onSubmit: showConfirm,
          buttonValidators: [
            /* all must be true for submit button to show */ lookupPrice > 0,
            validSharesInput,
            sharesInput !== "",
            parseInt(sharesInput) !== 0,
          ],
          inputs: [
            /* options for the single validated input field used */
            {
              label: "Shares",
              type: "Number",
              onChange: handleChange,
              name: "shares",
              validatorListener: setValidSharesInput,
              value: sharesInput as any /* casts number to string for form */,
              validators:
                /* each validation constraint corresponds to an error with same
                 * index in errorMessages array */
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
                      `maxNumber:${rowData.shares}` /* total shares */,
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
                      `you only have ${rowData.shares} shares of 
                      ${rowData.stock_symbol} to sell!`,
                    ],
            },
          ],
        }}
      />
      {/* depending on location, display text showing price of currently "selected"
       * stock as well as summary of total proposed transaction amount */}
      <div id="tradeInfo">
        {(location.pathname === "/buy" || location.pathname === "/sell") && (
          <Typography
            variant="subtitle1"
            className={lookupPrice > 0 ? classes.visible : classes.hidden}
          >
            {rowData.stock_name} ({rowData.stock_symbol}) current price:{" "}
            {numFormat(lookupPrice)}
          </Typography>
        )}
        <Typography
          variant="subtitle1"
          className={
            validSharesInput && sharesInput !== "" && sharesInput !== "0"
              ? classes.visible
              : classes.hidden
          }
        >
          {tradeType === "buy" ? "Purchase" : "Sale"} price:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(lookupPrice * parseInt(sharesInput))}
        </Typography>
      </div>
    </>
  );
}
