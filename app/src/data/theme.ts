import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/deepPurple";
import indigo from "@material-ui/core/colors/indigo";
import { common, green } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: indigo,
    success: green,
    common: common
  },
});

export default theme;
