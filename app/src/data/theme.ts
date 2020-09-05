import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/deepPurple";
import indigo from "@material-ui/core/colors/indigo";

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: indigo,
  },
  typography: {},
  overrides: {
    MuiTableCell: {
      root: {  //This can be referred from Material UI API documentation. 

      },
  }
  }
  
});

export default theme;
