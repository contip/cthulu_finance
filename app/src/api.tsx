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
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

export default async function ApiCall(
  payload: IAuthCall | ITradeCall | ILookupCall
): Promise<ICallError|IUser|IUserTransaction|IStockData|boolean|void> {
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let response: Response = await fetch(payload.url, {
    method: "POST",
    headers: payload.auth
      ? await authService.authHeader()
      : { "Content-Type": "application/json" },
    body: JSON.stringify(payload.body),
  });
  /* i should only return the 401 error in case of JWT validation issues */
  if (response.status === 401) {
    authService.logout();
    enqueueSnackbar("Error: Unauthorized!", { variant: "error" });
    return;
  } else if (response.status === 400 || response.status >= 402) {
    /* make sure to always return a message from nest */ 
    return {code: response.status, message: (await response.json()).message }
  } else {
    return await response.json();
}
}
