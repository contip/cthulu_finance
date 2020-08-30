import React, { useState, useEffect } from 'react';
import { authService } from "./auth.service";
import { useHistory } from 'react-router-dom';
import Table, { tableCol } from "./table";
import { HistoryColumnsMap, Urls } from './constants';
import { IUserTransaction, ITradeCall } from './interfaces';
import ApiCall from './api';
import { useSnackbar } from 'notistack';


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
    
    useEffect(() => {

      let payload: ITradeCall = {url: Urls.history, auth: true, body: {user_id: authService.currentUserValue.userData.id}};
      ApiCall(payload).then((response) => {
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
    if (!userHistory) {return <h1>loading...</h1>}
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
            pageSize: 20,
            search: false,
          }
        }}/>
      </React.Fragment>
    )
}
