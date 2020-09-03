import React from 'react';
import { Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
    },
    footerText: {
        

    }
  })
);
export default function Footer(): JSX.Element {
  let classes = useStyles();

    return(
        <div className={classes.root}>
<Typography color="primary" variant="subtitle2" className={classes.footerText} >
    Miskatonic Research Systems, 2020.
</Typography>
</div>
    )
}