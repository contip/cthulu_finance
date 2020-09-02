import React, { useState, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { IUser, IUserHoldingFull } from "../data/interfaces";
import { authService } from "./auth.service";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@material-ui/core";
import logo from "../img/logo.png";
import { numFormat } from "./helpers";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      color: "white",
    },
    // infoBar: {
    //   // textAlign: "center",
    //   color: "teal",
    // },
    bung: {
      textAlign: "center",
      // color:"white",
    },
    textButtons: {
      color: "white",
    },
    selected: {
      color: "LimeGreen",
    },
    infoBarTitles: {
      color: "black",
      padding: 5,
    },
    infoBarSums: {
      color: "green",
      padding: 5,
    },
    profileButton: {},
  })
);

export default function MenuAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let [currentUser, setCurrentUser] = useState<IUser | null>(null);
  let location = useLocation();

  useEffect(() => {
    authService.currentUser.subscribe((user) => setCurrentUser(user));
  }, [currentUser]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function getTotal() {
    let sum: number = 0;
    if (currentUser?.userData.holdings) {
      for (let i = 0; i < currentUser.userData.holdings.length; i++) {
        sum += (currentUser.userData.holdings[i] as IUserHoldingFull).value;
      }
    }
    return sum;
  }
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div>
            <IconButton
              edge="start"
              component={Link}
              to={currentUser?.accessToken ? "/" : "/login"}
              color="inherit"
              aria-label="menu"
            >
              {<img src={logo} alt="Logo" />}
            </IconButton>
          </div>
          {currentUser?.accessToken && (
            <>
              <Button
                component={Link}
                to="/lookup"
                variant="text"
                color="secondary"
              >
                <Typography
                  variant="button"
                  className={
                    location.pathname === "/lookup"
                      ? classes.selected
                      : classes.textButtons
                  }
                >
                  Lookup
                </Typography>
              </Button>
              <Button
                component={Link}
                to="/buy"
                variant="text"
                color="secondary"
              >
                <Typography
                  variant="button"
                  className={
                    location.pathname === "/buy"
                      ? classes.selected
                      : classes.textButtons
                  }
                >
                  Buy
                </Typography>
              </Button>
              <Button
                component={Link}
                to="/sell"
                variant="text"
                color="secondary"
              >
                <Typography
                  variant="button"
                  className={
                    location.pathname === "/sell"
                      ? classes.selected
                      : classes.textButtons
                  }
                >
                  Sell
                </Typography>
              </Button>
              {/* why do i need this empty text to make sure button justifies
                to the right? */}
              <Typography variant="h6" className={classes.title}></Typography>
            </>
          )}

          {currentUser?.accessToken && (
            <div className={`${classes.profileButton} ${location.pathname === "/" || location.pathname === "/history" ? classes.selected : ""}`}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle fontSize="large" />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <Link
                  to="/"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <MenuItem onClick={handleClose}>My Portfolio</MenuItem>
                </Link>
                <Link
                  to="/history"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <MenuItem onClick={handleClose}>Trade History</MenuItem>
                </Link>
                <Link
                  to="/logout"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <MenuItem onClick={handleClose}>Log Out</MenuItem>
                </Link>
              </Menu>
            </div>
          )}
          {!currentUser && (
            <>
              {/* again needed phantom typography to get flex box to justify buttons right */}
              <Typography variant="h6" className={classes.title}></Typography>
              <Button
                component={Link}
                to="/register"
                variant="text"
                color="primary"
              >
                <Typography variant="button" className={`${classes.title} ${location.pathname === "/register" ? classes.selected : ""}`}>
                  Register
                </Typography>
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="text"
                color="primary"
              >
                <Typography variant="button" className={`${classes.title} ${location.pathname === "/login" ? classes.selected : ""}`}>
                  Login
                </Typography>
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      {currentUser && currentUser.userData && currentUser.accessToken && (
        <div className={classes.bung}>
          <Typography variant="caption" className={classes.infoBarTitles}>
            Cash:
          </Typography>
          <Typography variant="caption" className={classes.infoBarSums}>
            {numFormat(currentUser?.userData.cash)}
          </Typography>

          {currentUser.userData.holdings &&
            currentUser.userData.holdings.length > 0 && (
              <>
                {" "}
                <Typography variant="caption" className={classes.infoBarTitles}>
                  Portfolio:
                </Typography>
                <Typography variant="caption" className={classes.infoBarSums}>
                  {numFormat(getTotal())}
                </Typography>{" "}
              </>
            )}
          <Typography variant="caption" className={classes.infoBarTitles}>
            Total:
          </Typography>
          <Typography variant="caption" className={classes.infoBarSums}>
            {currentUser.userData.holdings &&
            currentUser.userData.holdings.length > 0
              ? numFormat(getTotal() + currentUser?.userData.cash)
              : numFormat(currentUser.userData.cash)}
          </Typography>
        </div>
      )}
    </div>
  );
}
