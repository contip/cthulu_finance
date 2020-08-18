import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Lookup from './lookup-api';
import App from './app';
import Login from './login';

// ReactDOM.render(
//   <div>
//   <Lookup />
//   <App />
//   <Login />
//   </div>, document.getElementById('root') as HTMLElement
// );
ReactDOM.render(
  <div>
  <App />
  </div>, document.getElementById('root') as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
