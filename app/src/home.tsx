import React, { useState, useEffect, useLayoutEffect, Suspense } from "react";
import { IUserHolding } from "./interfaces";
import Table, { tableCol } from "./table";
import { HoldingsColumnsMap } from "./constants";
import { authService } from "./auth.service";


/* TODO: implement stronger typing and document code */

  const tableCols: Array<tableCol> = [];
  Object.keys(HoldingsColumnsMap).forEach((key) => {
    if (key != "tableData") {
      tableCols.push({ title: HoldingsColumnsMap[key], field: key });
    }
  });


  export default function Home() {
      let [userHoldings, setUserHoldings] = useState<Array<IUserHolding>|null>(null);

      useEffect(() => {
          authService.updateUserData().then(() => {setUserHoldings(authService.currentUserValue.userData.holdings)})
          return () => {
              /* what u need to do for cleanup??? */
          }
      }, [])
      
    if (!userHoldings) {
        return <h3>looking up your stuff my dude...</h3>
    }
    return (
          <React.Fragment>
            <Table {...{tableCols: tableCols, data: userHoldings, title: 'bung', options: {
            paging: false,
            showSelectAllCheckbox: false,
            search: false,
          }}} />
  </React.Fragment>

        
    )

  }