import * as React from 'react';
import { authService } from './auth.service';
import './index.css';
import { BrowserRouter as Router, Route, Link, Switch, useHistory } from 'react-router-dom';
import LoginForm from './login';
import Logout from './logout';
import Register from './register';
import Test from './test';
import { withRouter } from 'react-router';

interface appState {
    currentUser: object | null
}
export default class App extends React.Component<{}, appState> {
    constructor(props: any) {
        super(props);

        this.state = {
            currentUser: null
        };
    }
    

    componentDidMount() {
        authService.currentUser.subscribe(x => this.setState({ currentUser: x }));
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
        return(
            <Router>
                <div>
                    <nav>
                        <Link to="/login">Bitch log in</Link>
                        <Link to="/register">Bitch register</Link>
                    </nav>
                    <Switch>
                        <Route exact path="/login" component={LoginForm} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/test" component={Test} />
                        <Logout />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export { App };