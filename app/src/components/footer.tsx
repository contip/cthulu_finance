import React from "react";
import { Typography, Box, Link } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "10px",
      textAlign: "center",
    },
    footerText: {
      color: "white",
    },
    link: {
      color: "#8c9eff",
    },
  })
);
export default function Footer(): JSX.Element {
  let classes = useStyles();

  return (
    <Box bgcolor="primary.main" className={classes.root}>
      <Typography variant="body2" className={classes.footerText}>
        Miskatonic University, 2024.
      </Typography>
      <Typography variant="body2" className={classes.footerText}>
        Financial information provided by{" "}
        <Link
          className={classes.link}
          rel="noreferrer"
          href="https://finance.yahoo.com"
        >
          Yahoo Finance
        </Link>
      </Typography>
    </Box>
  );
}
