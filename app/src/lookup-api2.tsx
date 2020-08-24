import * as React from "react";
import { authService } from "./auth.service";
import { LookupColumnsMap } from "./constants";

export interface stockData {
  companyName: string;
  symbol: string;
  latestPrice: number;
  previousClose?: number;
  low?: number;
  lowTime?: Date | string;
  high?: number;
  highTime?: Date | string;
  week52Low?: number;
  week52High?: number;
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
  console.log(body);

  let payloadBuilder: any = {};
  Object.keys(LookupColumnsMap).forEach(element => {
    if (body[element]) {
      if (element == "lowTime" || element == "highTime") {
        if (!body[element.substr(0, element.indexOf("T"))]) {
          delete body[element];
        } else {
          payloadBuilder[element] = new Intl.DateTimeFormat("en-Us", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        }).format(body[element]);
      }
          
        } else {
          payloadBuilder[element] = body[element]
        }
      }
    }
  );
  let stockData: stockData = payloadBuilder;
  return stockData;
}

export default LookupApi2;
