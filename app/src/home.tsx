import React, { ReactElement } from "react";
import { authService, IUserHolding, IUserData } from "./auth.service";
/* i shouldn't be directly linking css file like this... right? */
import BootstrapTable from "react-bootstrap-table-next";
import LookupApi from "./lookup-api";
import Table, { tableCol } from "./table";
import { HoldingsColumnsMap } from "./constants";

export function Home(props: any) {
  // /* get the user infos */
  // let userInfo: IUserData = authService.currentUserValue.userData;
  // /* send the array to the table function */
  // let bung = (userInfo.holdings && userInfo.holdings.length > 0)
  //   ? holdingsTable(userInfo.holdings)
  //   : "There doesn't seem to be anything here.  Have you considered making \
  //   a purchse?";

  let bung1 = authService.currentUserValue;
  // console.log(bung1);
  // console.log(bung1.userData);
  let holdings = getHoldingsValues(bung1.userData.holdings);
  console.log(holdings);
  let tableCols: Array<tableCol> = [];
  Object.keys(HoldingsColumnsMap).forEach((key) => {
    tableCols.push({ title: HoldingsColumnsMap[key], field: key });
  });
  console.log(tableCols);

  // let userSub = authService.currentUser.subscribe(async user => {
  //   console.log(user);
  //   console.log(user.userData);
  //   let bung = await getHoldingsValues(user.userData.holdings);
  //   console.log(bung);

  // })

  return (
    <div>
      <h1>Welcome {bung1.userData.username}</h1>
      <h4>Ur profile:  {Table(tableCols, holdings, 'bung')}</h4>
      <h1>{props.name}</h1>
    </div>
  );
}

/* TODO: before this function can be implemented, i need to properly re-
 * implement the lookup component */
function getHoldingsValues(holdingsArray: Array<IUserHolding>) {
  console.log("the holdings array i was passed is:", holdingsArray);
  holdingsArray.forEach(async (holding) => {
    let response = await LookupApi(holding.stock_symbol);
    holding.price = response?.latestPrice;
    holding.value = holding.shares * holding.price;
  });
  return holdingsArray;
}
