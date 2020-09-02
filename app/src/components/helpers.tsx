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

export default function Redirect() {
  /* wraps intended page in a div with key tied to location key, allowing
   * forced rerenders by react router links */
  let history = useHistory();
  const classes = useStyles();
  history.push("/");
  return (
    <div className={classes.root}>
      <CircularProgress color="secondary" />
    </div>
  );
}


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

/* for displaying properly formatted currency strings from numbers */
export function numFormat(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}
