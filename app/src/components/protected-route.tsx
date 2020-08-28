import React from "react";
import { Route, Redirect } from "react-router-dom";
import { authService } from "../auth.service";
import jwt_decode from "jwt-decode";

const PrivateRoute: React.FC<{
  component: React.FC;
  path: string;
  exact: boolean;
}> = (props) => {
  const authenticated = (!localStorage.getItem("currentUser") || !authService.currentUserValue)
    ? /* if there is a current user value, make sure the jwt isn't expired */
      false
    : !(
        new Date(
          1000 * jwt_decode<any>(authService.currentUserValue.accessToken).exp
        ) > new Date()
      )
    ? false
    : true;

  if (!authenticated) authService.logout();
  return authenticated ? (
    <Route path={props.path} exact={props.exact}>
      <props.component {...props} />
    </Route>
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRoute;
