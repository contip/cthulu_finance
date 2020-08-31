import React, { useState, useEffect, useLayoutEffect, Suspense } from "react";
import { IUserHolding, IUserHoldingFull } from "./interfaces";
import Table, { tableCol } from "./table";
import { HoldingsColumnsMap } from "./constants";
import { authService } from "./auth.service";
import { Tab } from "@material-ui/core";
import { Z_FIXED } from "zlib";
import Buy from "./buy";
import { render } from "@testing-library/react";
import QuickTrade from "./quick-trade";
import FullWidthTabs from "./select-menu";


/* TODO: implement stronger typing and document code */
/* TODO: make sure that currencies have $ symbol and are rounded to 2
 *       decimal places */

const tableCols: Array<tableCol | any> = [];
Object.keys(HoldingsColumnsMap).forEach((key) => {
  tableCols.push({ title: HoldingsColumnsMap[key], field: key, width: 250 });
  if (key == "price" || key == "value") {
    tableCols[tableCols.length - 1]["type"] = "currency";
  }
});

export default function Home(props: any) {
  let [userHoldings, setUserHoldings] = useState<Array<
    IUserHoldingFull
  > | null>(null);
  console.log("the state of userHoldings is...", userHoldings);

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
          actions: [
            {
              icon: "save",
              tooltip: "save user",
              onClick: (event: any, rowData: any) => {
                return (
                  <React.Fragment>
                    <Buy props={rowData} />
                  </React.Fragment>
                );
              },
            },
          ],
          title:
            authService.currentUserValue.userData.username + "'s Portfolio",
          detailPanel: [
            {
              tooltip: "bung",
              render: (rowData: any) => {
                return (
                  <div>
                  <FullWidthTabs {...rowData} />
                  </div>
                );
              },
            },
          ],
          options: {
            paging: false,
            showSelectAllCheckbox: false,
            search: false,
            // tableLayout: "fixed"
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
            {
              words: "Your Cash",
              total: authService.currentUserValue.userData.cash,
            },
            { total: getTotal() + authService.currentUserValue.userData.cash },
          ],
          title: "bung",
          options: {
            paging: false,
            showSelectAllCheckbox: false,
            search: false,
            header: false,
            showTitle: false,
            toolbar: false,
          },
        })}
      </>
    </React.Fragment>
  );
}

// function inLineBuy() {
//   return (rowData: any) => { return (
//     <Buy />
//     )
//   }
// }
