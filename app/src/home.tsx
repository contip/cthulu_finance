import React, { useState, useEffect, useLayoutEffect, Suspense } from "react";
import { IUserHolding } from "./interfaces";
import Table, { tableCol } from "./table";
import { HoldingsColumnsMap } from "./constants";
import { authService } from "./auth.service";
import { Tab } from "@material-ui/core";

/* TODO: implement stronger typing and document code */
/* TODO: make sure that currencies have $ symbol and are rounded to 2
 *       decimal places */

const tableCols: Array<tableCol | any> = [];
Object.keys(HoldingsColumnsMap).forEach((key) => {
  tableCols.push({ title: HoldingsColumnsMap[key], field: key });
  if (key == "price" || key == "value") {
    tableCols[tableCols.length - 1]["type"] = "currency";
  }
});

export default function Home() {
  let [userHoldings, setUserHoldings] = useState<Array<IUserHolding> | null>(
    null
  );

  useEffect(() => {
    authService.updateUserData().then(() => {
      setUserHoldings(authService.currentUserValue.userData.holdings);
    });
    return () => {
      /* what u need to do for cleanup??? */
    };
  }, []);

  function getTotal() {
    let sum: number = 0;
    if (userHoldings) {
      for (let i = 0; i < userHoldings.length; i++) {
        sum += userHoldings[i].value;
      }
    }
    console.log(sum);
    return sum;
  }

  if (!userHoldings) {
    return <h3>looking up your stuff my dude...</h3>;
  }
  return (
    <React.Fragment>
      <Table
        {...{
          tableCols: tableCols,
          data: userHoldings,
          title:
            authService.currentUserValue.userData.username + "'s Portfolio",
          options: {
            paging: false,
            showSelectAllCheckbox: false,
            search: false,
          },
        }}
      />
      <>
        {Table({
          tableCols: [
            { title: "bung", field: "words" },
            { title: "bung", field: "total", type: "currency" },
          ],
          data: [
            { words: "Your Cash", total: authService.currentUserValue.userData.cash },
            { total: getTotal() },
          ],
          title: "bung",
          options: {
            paging: false,
            showSelectAllCheckbox: false,
            search: false,
            header: false,
            showTitle: false,
          },
        })}
      </>
    </React.Fragment>
  );
}
