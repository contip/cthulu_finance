import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
import { Button, Grid, Container } from "@material-ui/core";
import MenuAppBar from "./components/navbar";
import Redirect from "./components/helpers";
import Footer from "./components/footer";

export default function App() {
  let [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const notistackRef = React.createRef<any>();
  const onClickDismiss = (key: any) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  useEffect(() => {
    const subscription = authService.currentUser.subscribe((user) =>
      setCurrentUser(user)
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser]);

  return (
    <React.Fragment>
      <CssBaseline />
      <SnackbarProvider
        style={{ marginTop: 75 }}
        maxSnack={1}
        autoHideDuration={3000}
        ref={notistackRef}
        action={(key) => (
          <Button style={{ color: "white" }} onClick={onClickDismiss(key)}>
            Dismiss
          </Button>
        )}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Router>
          <Container maxWidth="xl">
            <nav>
              <MenuAppBar />
            </nav>
            <Grid
              container
              spacing={5}
              direction="column"
              // alignItems="center"
              // alignContent="center"
              justify="flex-start"
              style={{
                // width: "100%",
                display: "flex",
                minHeight: "90vh",
                position: "relative",
                paddingTop: "10%",
                alignContent: "center",
              }}
            >
              <Grid item style={{ width: "100%", paddingBottom: "5%"}}>
                <Switch>
                  <PrivateRoute exact path="/" component={Home} />
                  <Route exact path="/login" component={LoginForm} />
                  <Route exact path="/register" component={Register} />
                  <PrivateRoute exact path="/buy" component={Buy} />
                  <PrivateRoute exact path="/sell" component={Sell} />
                  <PrivateRoute exact path="/history" component={History} />
                  <PrivateRoute exact path="/redirect" component={Redirect} />
                  <PrivateRoute exact path="/lookup" component={Lookup} />
                  <PrivateRoute
                    exact
                    path="/logout"
                    component={Logout as any}
                  />
                </Switch>
              </Grid>
            </Grid>
              <Grid item > 
                <Footer />
              </Grid>
          </Container>
        </Router>
      </SnackbarProvider>
    </React.Fragment>
  );
}
