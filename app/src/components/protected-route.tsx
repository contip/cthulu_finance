import React from "react";
import { Route, Redirect } from "react-router-dom";
import { authService } from "../auth.service";

const PrivateRoute: React.FC<{
  component: React.FC;
  path: string;
  exact: boolean;
}> = (props) => {
  const authenticated = (authService.currentUserValue) ? true : false;

  return authenticated ? (
    <Route path={props.path} exact={props.exact} component={props.component} />
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRoute;
