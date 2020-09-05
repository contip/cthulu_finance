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
      <Typography variant="subtitle2" className={classes.footerText}>
        Miskatonic Research Systems, 2020.
      </Typography>
      <Typography variant="subtitle2" className={classes.footerText}>
        Financial information provided by{" "}
        <Link
          className={classes.link}
          rel="noreferrer"
          href="https://iexcloud.io"
        >
          IEX Cloud
        </Link>
      </Typography>
    </Box>
  );
}
