import Hello from './hello';
import Clock from './Clock';
import Counter from './Counter';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import UselessTextInput from './lookup';
import { CountdownTimer } from './CountDown';
import Lookup from './lookup2';

ReactDOM.render(
  <UselessTextInput />, document.getElementById('root') as HTMLElement
);
let my_div = document.createElement('div');
my_div.setAttribute('id', 'my_div');
document.getElementById('root')?.appendChild(my_div);
ReactDOM.render(
  <Counter />, document.getElementById('my_div') as HTMLElement
);
let my_div2 = document.createElement('div');
my_div2.setAttribute('id', 'my_div2');
document.getElementById('root')?.appendChild(my_div2);

let my_div3 = document.createElement('div');
my_div3.setAttribute('id', 'my_div3');
document.getElementById('root')?.appendChild(my_div3);

ReactDOM.render(
  <Clock />, document.getElementById('my_div3') as HTMLElement
);

let my_div4 = document.createElement('div');
my_div4.setAttribute('id', 'my_div4');
document.getElementById('root')?.appendChild(my_div4);

ReactDOM.render(
  <Lookup />, document.getElementById('my_div4') as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
