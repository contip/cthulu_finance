import React, { useState, useEffect, useLayoutEffect, Suspense } from "react";
import { IUserHolding } from "./interfaces";
import LookupApi, { stockData } from "./lookup-api";
import Table, { tableCol } from "./table";
import { HoldingsColumnsMap } from "./constants";

export default function Home2(user: any) {
  let [userHoldings, setUserHoldings] = useState<Array<IUserHolding>>([
    {
      stock_name: "",
      stock_symbol: "",
      shares: 0,
      price: 0,
      value: 0,
    },
  ]);

    useEffect(() => {
    if (user && user.holdings && user.holdings.length > 0){
    let bung: Array<IUserHolding> = [...user.holdings];
    getHoldingQuotez(bung);}
  }, []);

  let bung = user.holdings;
  if (!bung || bung.length == 0) {
    return (
      <h3>
        there doesn't seem to be anything here... have u considered making a
        purchase?
      </h3>
    );
  }



  async function getHoldingQuotez(holdingz: Array<IUserHolding>) {
    holdingz.forEach(async (holding: IUserHolding) => {
      setTimeout(async () => {
        holding.price = (await LookupApi(holding.stock_symbol)).latestPrice;
        holding.value = holding.shares * holding.price;
      }, 500);
    });
    setUserHoldings(holdingz);
  }

  const tableCols: Array<tableCol> = [];
  Object.keys(HoldingsColumnsMap).forEach((key) => {
    if (key != "tableData") {
      tableCols.push({ title: HoldingsColumnsMap[key], field: key });
    }
  });

  return (
  <Suspense fallback={<h3>retrieving ur stuff my dude</h3>}>
      <Table {...{tableCols: tableCols, data: userHoldings, title: user.username}} />
  </Suspense>);
}
