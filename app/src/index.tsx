import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Lookup from './lookup';
import App from './register_butt';
import { RegisterForm } from './register';

ReactDOM.render(
  <div>
  <Lookup />
  <RegisterForm />
  </div>, document.getElementById('root') as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
