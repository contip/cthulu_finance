import * as React from 'react';
import { authService } from './auth.service';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Lookup from './lookup';
import Login from './login';
import Logout from './logout';
import { AppState } from 'react-native';

interface appState {
    currentUser: object | null
}
export default class App extends React.Component<{},appState> {
    constructor(props: any) {
        super(props);

        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
       authService.currentUser.subscribe(x => this.setState({ currentUser: x }));
    }

    logout() {
        authService.logout();
    }

    render() {
        /* every time rendering happens, is when the check to see if user
         * is logged in or not should occur */
        console.log(this.state.currentUser);
        if (!this.state.currentUser)
        {
            return (
                <div>
                    <Login />
                </div>
            )
        }
        else {
        return (
            <div>
  <Lookup />
  <Logout />
  </div>
        );
    }
}
}

export { App };