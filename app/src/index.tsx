import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './app';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './data/theme';

// ReactDOM.render(
//   <div>
//   <Lookup />
//   <App />
//   <Login />
//   </div>, document.getElementById('root') as HTMLElement
// );
ReactDOM.render(
  <div>
    <ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
  </div>, document.getElementById('root') as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
