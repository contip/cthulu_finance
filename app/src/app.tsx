import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { authService } from "./components/auth.service";
import PrivateRoute from "./components/protected-route";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./index.css";
import LoginForm from "./views/login";
import Register from "./views/register";
import Lookup from "./views/lookup";
import Logout from "./views/logout";
import { IUser } from "./data/interfaces";
import Home from "./views/home";
import Buy from "./views/buy";
import Sell from "./views/sell";
import History from "./views/history";
import { SnackbarProvider } from "notistack";
import { Button } from "@material-ui/core";
import ButtonAppBar from "./components/navbar";
import MenuAppBar from "./components/navbar";


export default function App() {
  let [currentUser, setCurrentUser] = useState<IUser | null>(null);

  // add action to all snackbars
const notistackRef = React.createRef<any>();
const onClickDismiss = (key:any) => () => { 
    notistackRef.current.closeSnackbar(key);
}
  useEffect(() => {
    authService.currentUser.subscribe((user) => setCurrentUser(user));
  }, [currentUser]);

  return (
    <React.Fragment>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={4000}
        ref={notistackRef}
         action={(key) => (
        <Button onClick={onClickDismiss(key)}>
            Dismiss
        </Button>)}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
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
              {!currentUser && <Link to="/login">Log In!</Link>}
              {!currentUser && <Link to="/register">Register!</Link>}
            </nav>
            <nav>
                <MenuAppBar />
            </nav>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/login" component={LoginForm} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/buy" component={Buy} />
              <PrivateRoute exact path="/sell" component={Sell} />
              <PrivateRoute exact path="/history" component={History} />
              <PrivateRoute exact path="/lookup" component={Lookup} />
              <PrivateRoute exact path="/logout" component={Logout as any}/>
            </Switch>
          </div>
        </Router>
      </SnackbarProvider>
    </React.Fragment>
  );
}
