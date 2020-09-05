import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        fontFamily: "Chiller",
        marginBottom: "25px",
    },

  })
);

/* Basic title typography to let user know where they are in the app */
export default function Title(props: {view: string}) {
    let classes = useStyles();

    return(

        <Typography color="secondary" className={classes.root} variant="h3">
            {props.view.charAt(0).toUpperCase() + props.view.slice(1)}
        </Typography>
    )
}