import React, { useState, useEffect } from 'react';
import { authService } from "./auth.service";
import { useHistory } from 'react-router-dom';
import Table, { tableCol } from "./table";
import { HistoryColumnsMap } from './constants';
import { IUserTransaction } from './interfaces';


const tableCols: Array<tableCol | any> = [];
Object.keys(HistoryColumnsMap).forEach((key) => {
  tableCols.push({ title: HistoryColumnsMap[key], field: key, width: 250 });
  if (key == "stock_price" || key == "transaction_price") {
    tableCols[tableCols.length - 1]["type"] = "currency";
  }
});


export default function History() {
    let [userHistory, setUserHistory] = useState<Array<IUserTransaction>|null>(null);
    let history = useHistory();
    
    useEffect(() => {
      fetchHistory().then()
      return () => {
      }
    }, [])

    async function fetchHistory() {
      let response:any = await fetch("http://localhost:6969/trades/history", {
        method: "POST",
        headers: await authService.authHeader(),
        body: JSON.stringify({
          user_id: authService.currentUserValue.userData.id,
    
      })
    });
      if (response.status == 401) {
        alert("authentication error!  logging u out");
        authService.logout();
      }
      else if (response.status == 500) {
        alert("error communicating with server!  taking you home")
        return history.push('/');
      }
      else {
        
        response.json().then((response: any) => {
          setUserHistory(response);
          return;
        })
      }
    }

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
            paging: false,
            search: false,
          }
        }}/>
      </React.Fragment>
    )
}

