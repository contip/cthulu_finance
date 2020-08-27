import React, { useState, useEffect, useLayoutEffect, Suspense } from "react";
import { IUserHolding } from "./interfaces";
import Table, { tableCol } from "./table";
import { HoldingsColumnsMap } from "./constants";
import { authService } from "./auth.service";

/* TODO: implement stronger typing and document code */
/* TODO: make sure that currencies have $ symbol and are rounded to 2 
 *       decimal places */

const tableCols: Array<tableCol> = [];
Object.keys(HoldingsColumnsMap).forEach((key) => {
    tableCols.push({ title: HoldingsColumnsMap[key], field: key });
  }
);

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

  if (!userHoldings) {
    return <h3>looking up your stuff my dude...</h3>;
  }
  return (
    <React.Fragment>
      <Table
        {...{
          tableCols: tableCols,
          data: userHoldings,
          title: authService.currentUserValue.userData.username + "'s Portfolio",
          options: {
            paging: false,
            showSelectAllCheckbox: false,
            search: false,
          },
        }}/>
    </React.Fragment>
  );
}
