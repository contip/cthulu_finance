import React, { useState, useEffect } from "react";
import { IUserHoldingFull, ITableCol, ITradeProps } from "../data/interfaces";
import Table from "../components/table";
import { HoldingsColumnsMap } from "../data/constants";
import { authService } from "../components/auth.service";
import Trade from "../components/trade";
import ShopTwo from "@material-ui/icons/ShopTwo";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Title from "../components/title";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      textAlign: "center",
    },
    quickTrade: {
      textAlign: "center",
    },
    mainDisplay: {
      width: "100%",
      textAlign: "center",
    },
  })
);

const tableCols: Array<ITableCol> = [];
Object.keys(HoldingsColumnsMap).forEach((key) => {
  tableCols.push({ title: HoldingsColumnsMap[key], field: key, width: 350 });
  if (key === "price" || key === "value") {
    tableCols[tableCols.length - 1]["type"] = "currency";
  }
});

/* main landing page of app; displays table of user's stock portfolio */
export default function Home(): JSX.Element {
  let [userHoldings, setUserHoldings] =
    useState<Array<IUserHoldingFull> | null>(null);
  const classes = useStyles();

  /* silently get new JWT and refresh user holding data on load */
  useEffect(() => {
    authService.updateUserData().then(() => {
      setUserHoldings(authService.currentUserValue?.userData?.holdings);
    });
  }, []);

  /* if fetching data, display loading spinner (server must make individual
   * external api call for each stock owned by user to get price info) */
  if (!userHoldings) {
    return (
      <div className={classes.root}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className={classes.mainDisplay}>
      <Title
        view={authService.currentUserValue.userData.username + "'s Portfolio"}
      />
      <Table
        {...{
          tableCols: tableCols,
          data: userHoldings,
          title:
            authService.currentUserValue.userData.username + "'s Portfolio",
          detailPanel: [
            {
              icon: ShopTwo,
              tooltip: "Quick Trade",
              render: (rowData: any) => {
                let props: ITradeProps = {
                  stock_symbol: rowData?.stock_symbol ?? "",
                  stock_name: rowData?.stock_name ?? "",
                  latestPrice: rowData?.price ?? 0,
                  shares: rowData?.shares ?? undefined,
                };
                return (
                  <div className={classes.quickTrade}>
                    <Trade {...props} />
                  </div>
                );
              },
            },
          ],
          options: {
            paging: false,
            showSelectAllCheckbox: false,
            search: false,
          },
        }}
      />
    </div>
  );
}
