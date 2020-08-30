import React from "react";
import {
  IUserTransaction,
  IAuthCall,
  ITradeCall,
  ILookupCall,
} from "./interfaces";
import { Urls } from "./constants";
import { authService } from "./auth.service";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

export default async function ApiCall(
  payload: IAuthCall | ITradeCall | ILookupCall
) {
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let response: Response = await fetch(payload.url, {
    method: "POST",
    headers: payload.auth
      ? await authService.authHeader()
      : { "Content-Type": "application/json" },
    body: JSON.stringify(payload.body),
  });
  if (response.status === 401) {
    authService.logout();
    enqueueSnackbar("Error: Unauthorized!", { variant: "error" });
  } else {
    let body = await response.json();
    if (body) {
      return body;
    } else {return response.status}
  }
}
