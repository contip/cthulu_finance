import * as React from "react";
import { authService } from "./auth.service";

export interface stockData {
  companyName: string;
  symbol: string;
  latestPrice: number;
  previousClose: number;
  low: number;
  lowTime: Date | string;
  high: number;
  highTime: Date | string;
  week52Low: number;
  week52High: number;
}

async function LookupApi2(stock_symbol: string): Promise<stockData | null> {
  let header = await authService.authHeader();
  let response = await fetch("http://localhost:6969/lookup", {
    method: "POST",
    headers: header,
    body: JSON.stringify({ name: stock_symbol }),
  });
  /* only possible error is not found (i.e. user entered invalid symbol) */
  if (response.status >= 400) {
    //alert("stock lookup error!");
    return null;
  }
  let body: any = await response.json();

  let selected: any = (({
    companyName,
    symbol,
    latestPrice,
    previousClose,
    low,
    lowTime,
    high,
    highTime,
    week52Low,
    week52High,
  }) => ({
    companyName,
    symbol,
    latestPrice,
    previousClose,
    low,
    high,
    week52Low,
    week52High,
    lowTime,
    highTime,
  }))(body);

  console.log(selected);

  /* convert the dates (ms since epoch) to strings before saving the data */
  /* (in the worst way imaginable) */
  selected.lowTime = new Intl.DateTimeFormat("en-Us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(selected.lowTime);
  selected.highTime = new Intl.DateTimeFormat("en-Us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(selected.highTime);

  // Object.keys(selected).forEach(element => {
  //   if (element == 'lowTime' || element == 'highTime') {
  //     console.log('element is:', element);
  //      selected.element = new Intl.DateTimeFormat('en-Us', { year: 'numeric', month: 'numeric', day: 'numeric',
  // hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(selected.element);

  // }
  // })

  let stockData: stockData = selected;
  console.log(stockData);
  return stockData;
}

export default LookupApi2;
