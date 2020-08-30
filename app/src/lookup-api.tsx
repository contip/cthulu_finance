import * as React from "react";
import { authService } from "./auth.service";
import { LookupColumnsMap } from "./constants";
import { exception } from "console";
import { IStockData } from "./interfaces";

async function LookupApi(stock_symbol: string): Promise<IStockData> {
  let header = await authService.authHeader();
  let response = await fetch("http://localhost:6969/lookup", {
    method: "POST",
    headers: header,
    body: JSON.stringify({ name: stock_symbol }),
  });
  /* only possible error is not found (i.e. user entered invalid symbol) */
  if (response.status >= 400) {
    //alert("stock lookup error!");
    //return null;
    alert("implement error handling u noob");
  }
  let body: any = await response.json();
  //console.log(body);
  /* the API used for stock quotes sometimes does not return data for certain
   * fields (i.e. no recent min price, or no yearly max), therefore exclude any
   * null fields in the response body */
  let payloadBuilder: any = {};
  Object.keys(LookupColumnsMap).forEach((element) => {
    if (body[element]) {
      if (element == "lowTime" || element == "highTime") {
        /* api sometimes includes min/max dates without the associated min/max
         * price.. in this case, discard the date */
        if (!body[element.substr(0, element.indexOf("T"))]) {
          delete body[element];
        } else {
          /* if both date and min/max present, make date into readable format */
          payloadBuilder[element] = new Intl.DateTimeFormat("en-Us", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(body[element]);
        }
      } else {
        payloadBuilder[element] = body[element];
      }
    }
  });
  /* recast the response body as a stockData type and return it */
  let stockData: IStockData = payloadBuilder;
  return stockData;
}

export default LookupApi;
