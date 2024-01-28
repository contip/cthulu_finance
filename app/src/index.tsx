import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./data/theme";
import './data/fonts/LibreBaskerville.ttf'

ReactDOM.render(
  <div>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </div>,
  document.getElementById("root") as HTMLElement
);