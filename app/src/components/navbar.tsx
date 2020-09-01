import React, { useState, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { IUser } from "../data/interfaces";
import { authService } from "./auth.service";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import logo from '../img/logo.png'

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
    },
    logoDiv: {

    },
    logoButton: {

    },
    textButtons: {

    }
  })
);

export default function MenuAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    authService.currentUser.subscribe((user) => setCurrentUser(user));
  }, [currentUser]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
            <div className={classes.logoDiv}>
          <IconButton
            edge="start"
            component={Link}
            to="/"
            className={classes.logoButton}
            color="inherit"
            aria-label="menu"
          >
            {<img src={logo} alt="Logo" />}
          </IconButton>
          </div>
{currentUser?.accessToken && <>
          <Button
              component={Link}
              to="/lookup"
              variant="contained"
              color="primary"
            >
              <Typography variant="button" className={classes.textButtons}>
                Lookup
              </Typography>
            </Button>
            <Button
              component={Link}
              to="/buy"
              variant="contained"
              color="primary"
            >
              <Typography variant="button" className={classes.textButtons}>
                Buy
              </Typography>
            </Button>
            <Button
              component={Link}
              to="/sell"
              variant="contained"
              color="primary"
            >
              <Typography variant="button" className={classes.textButtons}>
                Sell
              </Typography>
            </Button>
          <Typography variant="h6" className={classes.title}>
            {`${currentUser?.userData.username} - Cash: $${currentUser?.userData.cash.toFixed(2)}` }
          </Typography></>
}

          
          {currentUser?.accessToken && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
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
        {!currentUser && 
        <>
              <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
            >
              <Typography variant="button" className={classes.title}>
                Register
              </Typography>
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
            >
              <Typography variant="button" className={classes.title}>
                Login
              </Typography>
            </Button>
        </>
        
        }
        </Toolbar>
      </AppBar>
    </div>
  );
}
