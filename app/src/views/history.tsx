import React, { useState, useEffect } from "react";
import { authService } from "../components/auth.service";
import Table from "../components/table";
import { HistoryColumnsMap, Urls } from "../data/constants";
import { IUserTransaction, ITradeCall, ITableCol } from "../data/interfaces";
import { fetchCall } from "../components/helpers";
import { useSnackbar } from "notistack";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
  })
);

/* column titles and types for the table display */
const tableCols: Array<ITableCol> = [];
Object.keys(HistoryColumnsMap).forEach((key) => {
  tableCols.push({ title: HistoryColumnsMap[key], field: key, width: 250 });
  if (key === "stock_price" || key === "transaction_price") {
    tableCols[tableCols.length - 1]["type"] = "currency";
  }
});

/* returns paginated, sortable table of user purchases and sales, initially
 * given from most recent to oldest */
export default function History(): JSX.Element {
  let [userHistory, setUserHistory] = useState<Array<IUserTransaction> | null>(
    null
  );
  let { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  /* fetch user trade data from server, otherwise display error snack */
  useEffect(() => {
    let payload: ITradeCall = {
      url: Urls.history,
      auth: true,
      body: { user_id: authService.currentUserValue.userData.id },
    };
    fetchCall(payload).then((response) => {
      if (response.code) {
        enqueueSnackbar(response.message, { variant: "error" });
        setUserHistory(null);
      } else {
        /* before setting response, remove microseconds from date column */
        response.forEach((transaction: IUserTransaction) => {
          transaction.date = transaction.date.split(".")[0];
        });
        setUserHistory(response);
      }
    });
  }, []);

  /* if fetching data, display a loading spinner */
  if (!userHistory) {
    return (
      <div className={classes.root}>
        <CircularProgress />
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Table
        {...{
          tableCols: tableCols,
          data: userHistory.reverse(),
          title:
            authService.currentUserValue.userData.username +
            "'s Transaction History",
          options: {
            showSelectAllCheckbox: false,
            paging: true,
            pageSize: 10,
            search: false,
          },
        }}
      />
    </React.Fragment>
  );
}
