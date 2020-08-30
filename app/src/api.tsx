import React from "react";
import {
  IUserTransaction,
  IAuthCall,
  ITradeCall,
  ILookupCall,
  ICallError,
  IStockData,
  IUser,
} from "./interfaces";
import { Urls } from "./constants";
import { authService } from "./auth.service";

export default async function ApiCall(
  payload: IAuthCall | ITradeCall | ILookupCall
) {
  let response: Response = await fetch(payload.url, {
    method: "POST",
    headers: payload.auth
      ? await authService.authHeader()
      : { "Content-Type": "application/json" },
    body: JSON.stringify(payload.body),
  });
  if (response.status >= 400) {
    /* make sure to always return a message from nest */ 
    return {code: response.status, message: (await response.json()).message }
  } else {
    return await response.json();
}
}
