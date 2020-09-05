import React from "react";
import { IAuthCall, ITradeCall, ILookupCall } from "../data/interfaces";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, Theme, createStyles } from "@material-ui/core";

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
  })
);

/* general configurable helper function to send POST requests to the server */
export async function fetchCall(payload: IAuthCall | ITradeCall | ILookupCall) {
  let response: Response = await fetch(payload.url, {
    method: "POST",
    headers: payload.auth
      ? await authService.authHeader()
      : { "Content-Type": "application/json" },
    body: JSON.stringify(payload.body),
  });
  if (response.status >= 400) {
    /* server will always return an appropriate message in response body */
    return { code: response.status, message: (await response.json()).message };
  } else {
    return await response.json();
  }
}

/* convert input numbers to properly formatted currency strings */
export function numFormat(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

/* currently no supported way to force rerender of a route without a browser
 * refresh using react router.  since table data requires refresh after quick
 * trade, and since browser refresh would break snackbar alerts, this helper
 * route renders a loading spinner and performs a redirect, solving the issue
 * see https://github.com/ReactTraining/react-router/issues/7416 */
export default function Redirect() {
  let history = useHistory();
  const classes = useStyles();
  history.push("/");
  return (null
    // <div className={classes.root}>
    //   <CircularProgress color="secondary" />
    // </div>
  );
}