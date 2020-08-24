import * as React from "react";
import { authService } from "./auth.service";
import "./index.css";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useHistory,
} from "react-router-dom";
import LoginForm from "./login";
import Register from "./register";
import PrivateRoute from "./components/protected-route";
import Lookup from "./lookup";
import { Home } from "./home";
import Lookup2 from "./lookup2";
import CssBaseline from '@material-ui/core/CssBaseline';

interface appState {
  currentUser: object | null;
}
export default class App extends React.Component<{}, appState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentUser: null,
    };
  }

  componentDidMount() {
    authService.currentUser.subscribe((x) => this.setState({ currentUser: x }));
  }

  // logout() {
  //     authService.logout();
  //     //this.props.history.push('/login');
  // }

  render() {
    // /* every time rendering happens, is when the check to see if user
    //  * is logged in or not should occur */
    // console.log(this.state.currentUser);
    // if (!this.state.currentUser) {
    //         console.log('bitch i should be showing login');
    //     return (
    //         <div>
    //             <Login />
    //         </div>
    //     )
    // }
    // else {
    //     return (
    //         <div>
    //             <Lookup />
    //             <Logout />
    //         </div>
    //     );
    // }
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
            {this.state.currentUser && (
              <div>
                <Link to="/lookup">Bitch Members Only</Link>
                <Link to="/lookup2">Look Up a Dang Stock!</Link>
              </div>
            )}
            {!this.state.currentUser && <Link to="/login">Bitch log in</Link>}
            {!this.state.currentUser && (
              <Link to="/register">Bitch register</Link>
            )}
          </nav>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/lookup" component={Lookup} />
            <PrivateRoute exact path="/lookup2" component={Lookup2} />
          </Switch>
        </div>
      </Router>
      </React.Fragment>
    );
  }
}

export { App };
