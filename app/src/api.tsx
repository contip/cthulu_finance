import {
  IAuthCall,
  ITradeCall,
  ILookupCall,
} from "./interfaces";
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
    /* server will always return an appropriate message in response body */
    return {code: response.status, message: (await response.json()).message }
  } else {
    return await response.json();
}
}
