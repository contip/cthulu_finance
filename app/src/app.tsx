import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { authService } from "./auth.service";
import PrivateRoute from "./components/protected-route";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./index.css";
import LoginForm from "./login";
import Register from "./register";
import Lookup from "./lookup";
import LogoutButton from "./logout";
import { IUser } from "./interfaces";
import Home from "./home";
import Buy from "./buy";
import Sell from "./sell";
import History from "./history";
import { SnackbarProvider } from "notistack";

export default function App() {
  let [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    authService.currentUser.subscribe((user) => setCurrentUser(user));
  }, [currentUser]);

  return (
    <React.Fragment>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{horizontal: "center", vertical: "bottom"}}>
        <Router>
          <div>
            {/* if user is logged in, don't display the login and register 
                links */}

            {/* navbar should be its own component which also has access to auth
           state and can therefore determine what links to show in nav */}
            <nav>
              {currentUser && (
                <div>
                  <Link to="/">Home</Link>
                  <Link to="/lookup">Look Up a Dang Stock!</Link>
                  <Link to="/buy">Purchase</Link>
                  <Link to="/sell">Sell a dang thing</Link>
                  <Link to="/history">Get ur dang transaction history</Link>
                  <Link to="/logout">Log out my dude</Link>
                </div>
              )}
              {!currentUser && <Link to="/login">Bitch log in</Link>}
              {!currentUser && <Link to="/register">Bitch register</Link>}
            </nav>
            <Switch>
              <PrivateRoute exact path="/" component={Home} {...currentUser} />
              <Route exact path="/login" component={LoginForm} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/buy" component={Buy} />
              <PrivateRoute exact path="/sell" component={Sell} />
              <PrivateRoute exact path="/history" component={History} />
              <PrivateRoute exact path="/lookup" component={Lookup} />
              <PrivateRoute exact path="/logout" component={LogoutButton} />
            </Switch>
          </div>
        </Router>
      </SnackbarProvider>
    </React.Fragment>
  );
}
