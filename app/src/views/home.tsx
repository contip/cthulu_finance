import React, { useState, useEffect } from "react";
import { IUserHoldingFull, tableCol } from "../data/interfaces";
import Table  from "../components/table";
import { HoldingsColumnsMap } from "../data/constants";
import { authService } from "../components/auth.service";
import Trade from "../components/trade";
import { Container, Box } from "@material-ui/core";
import ShopTwo from "@material-ui/icons/ShopTwo";


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

export default function Home() {
  let [userHoldings, setUserHoldings] = useState<Array<
    IUserHoldingFull
  > | null>(null);

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
          title:
            authService.currentUserValue.userData.username + "'s Portfolio",
          detailPanel: [
            {
              icon: ShopTwo,
              tooltip: "Quick Trade",
              render: (rowData: any) => {
                return (
                  <div>
                  <Trade {...rowData} />
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
      {/* <Box width="100%">
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
      </Box> */}
    </React.Fragment>
  );
}

// function inLineBuy() {
//   return (rowData: any) => { return (
//     <Buy />
//     )
//   }
// }
