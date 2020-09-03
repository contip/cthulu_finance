import React from "react";
import { Route, Redirect } from "react-router-dom";
import { authService } from "./auth.service";
import jwt_decode from "jwt-decode";

/* definition for react router protected route; gives authentication method */
const PrivateRoute: React.FC<{
  component: React.FC;
  path: string;
  exact: boolean;
}> = (props) => {
  /* returns true if user has userData in localStorage and a valid JWT that is
   * not expired */
  const authenticated =
    !localStorage.getItem("currentUser") || !authService.currentUserValue
      ?
        false
      : !(  /* also return false if converted JWT date is passed / expired */
          new Date(
            1000 * jwt_decode<any>(authService.currentUserValue.accessToken).exp
          ) > new Date()
        )
      ? false
      : true;
  if (!authenticated) authService.logout();
  return authenticated ? (
    /* if auth check passes, pass through all props, otherwise drop to login */
    <Route path={props.path} exact={props.exact}>
      <props.component {...props} />
    </Route>
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRoute;
