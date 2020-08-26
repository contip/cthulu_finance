import React from "react";
import { Route, Redirect } from "react-router-dom";
import { authService } from "../auth.service";
import jwt_decode from "jwt-decode";

const PrivateRoute: React.FC<{
  component: React.FC;
  path: string;
  exact: boolean;
}> = (props) => {
  const authenticated = !authService.currentUserValue
    ? /* if there is a current user value, make sure the jwt isn't expired */ 
      false
    : !(
        new Date(
          1000 * jwt_decode<any>(authService.currentUserValue.accessToken).exp
        ) > new Date()
      )
    ? false
    : true;

  return authenticated ? (
    <Route path={props.path} exact={props.exact} component={props.component} />
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRoute;
