import * as React from "react";
import { authService } from "./auth.service";

export interface stockData {
  companyName: string;
  symbol: string;
  latestPrice: number;
  previousClose: number;
  low: number;
  high: number;
  week52Low: number;
  week52High: number
  lowTime: Date;
  highTime: Date;
}

async function LookupApi2(stock_symbol: string): Promise<stockData | null> {
	let header = await authService.authHeader();
	let response = await fetch("http://localhost:6969/lookup", {
		method: "POST",
		headers: header,
		body: stock_symbol,
	});
	if (response.status >= 400) {
		alert("stock lookup error!");
		return null;
	}
    let body: any = await response.json();
    
    const selected: any = (({ companyName, symbol, latestPrice, 
        previousClose, low, high, week52Low, week52High, lowTime, highTime }) => 
        ({ companyName, symbol, latestPrice, previousClose, low, high,
             week52Low, week52High, lowTime, highTime }))(body);

    selected.lowTime = new Date(selected.lowTime);
    selected.highTime = new Date(selected.highTime);

    let stockData: stockData = selected;
    console.log(stockData);
    return stockData;
}