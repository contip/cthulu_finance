import React, { ReactElement } from "react";
import { authService, IUserHolding, IUserData } from "./auth.service";
/* i shouldn't be directly linking css file like this... right? */
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";

interface IUserHoldingPrices extends IUserHolding {
  price: number;
  value: number;
}

export const Home = () => {
  /* get the user infos */
  let userInfo: IUserData = authService.currentUserValue.userData;

  /* send the array to the table function */
  let bung = (userInfo.holdings && userInfo.holdings.length > 0)
    ? holdingsTable(userInfo.holdings)
    : "There doesn't seem to be anything here.  Have you considered making \
    a purchse?";

  return (
    <div>
      <h1>Welcome {userInfo.username}</h1>
      <h4>Ur profile:</h4>
      {bung}
    </div>
  );
};

function holdingsTable(holdingsArray: Array<IUserHolding>) {
  const columns = [
    {
      dataField: "stock_name",
      text: "Stock Name",
    },
    {
      dataField: "stock_symbol",
      text: "Symbol",
    },
    {
      dataField: "shares",
      text: "Shares",
    },
  ];
  return (
    <div>
      <BootstrapTable
        keyField="stock_name"
        data={holdingsArray}
        columns={columns}
      />
    </div>
  );
}

/* TODO: before this function can be implemented, i need to properly re-
 * implement the lookup component */
function getHoldingsValues(
  holdingsArray: Array<IUserHolding>
): Array<IUserHoldingPrices> | any {
  return null;
}
