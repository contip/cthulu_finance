import React, { useState, useEffect } from 'react';
import { authService } from "../components/auth.service";
import { useHistory } from 'react-router-dom';
import Table from "../components/table";
import { HistoryColumnsMap, Urls } from '../data/constants';
import { IUserTransaction, ITradeCall, tableCol } from '../data/interfaces';
import {fetchCall} from '../components/helpers';
import { useSnackbar } from 'notistack';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
  }),
);


const tableCols: Array<tableCol | any> = [];
Object.keys(HistoryColumnsMap).forEach((key) => {
  tableCols.push({ title: HistoryColumnsMap[key], field: key, width: 250 });
  if (key == "stock_price" || key == "transaction_price") {
    tableCols[tableCols.length - 1]["type"] = "currency";
  }
});


export default function History() {
    let [userHistory, setUserHistory] = useState<Array<IUserTransaction>|null>(null);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
    let history = useHistory();
    
const classes = useStyles();
    useEffect(() => {

      let payload: ITradeCall = {url: Urls.history, auth: true, body: {user_id: authService.currentUserValue.userData.id}};
      fetchCall(payload).then((response) => {
        if (response.code) {
          enqueueSnackbar(response.message, { variant: "error" });
          setUserHistory(null);
        } else { 
          /* before setting response, cull the microseconds from the date col */
          response.forEach((transaction: IUserTransaction) => {
            transaction.date = transaction.date.split(".")[0];
          })
          setUserHistory(response);
        }
      }
      );
      return () => {
      }
    }, [])

    /* must implement the loading... system in a more general way */
    if (!userHistory) {return (<div className={classes.root}>
      <CircularProgress />
      <CircularProgress color="secondary" />
    </div>)}
    return (
      <React.Fragment>
        <Table
        {...{
          tableCols: tableCols,
          data: userHistory.reverse(),
          title: authService.currentUserValue.userData.username + "'s Transaction History",
          options: {
            showSelectAllCheckbox: false,
            paging: true,
            pageSize: 10,
            search: false,
          }
        }}/>
      </React.Fragment>
    )
}
