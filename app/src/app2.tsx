import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { authService } from "./auth.service";
import PrivateRoute from "./components/protected-route";
import CssBaseline from '@material-ui/core/CssBaseline';
import "./index.css";
import LoginForm from "./login";
import Register from "./register";
import Lookup from "./lookup";
import { Home } from "./home";
import LogoutButton from "./logout";
import { IUser } from './interfaces';
import Home2 from './home2';

export default function App2() {
    let [currentUser, setCurrentUser] = useState<IUser | null>(null);

    useEffect(() => {
        authService.currentUser.subscribe((user) => setCurrentUser(user));
    }, [currentUser]);

    
    return (
 <React.Fragment>
      <CssBaseline />
      <Router>
        <div>
          {/* if user is logged in, don't display the login and register 
                links */}

          {/* navbar should be its own component which also has access to auth
           state and can therefore determine what links to show in nav */}
          <nav>
            {currentUser && (
              <div>
                <Link to="/lookup2">Look Up a Dang Stock!</Link>
                <Link to="/logout">Log out my dude</Link>

              </div>
            )}
            {!currentUser && <Link to="/login">Bitch log in</Link>}
            {!currentUser && (
              <Link to="/register">Bitch register</Link>
            )}
          </nav>
          <Switch>
            <PrivateRoute exact path="/" component={() => <Home
              {...currentUser?.userData}/>} />
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/lookup2" component={Lookup} />
            <PrivateRoute exact path="/logout" component={LogoutButton} />

          </Switch>
        </div>
      </Router>
      </React.Fragment>



    )


}