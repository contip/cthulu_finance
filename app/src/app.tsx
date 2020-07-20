import * as React from 'react';
import { authService } from './auth.service';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Lookup from './lookup';
import Login from './login';

export default class App extends React.Component {
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
        const currentUser = this.state;
        return (
            <div>
  <Lookup />
  <Login />
  </div>
        );
    }
}

export { App };