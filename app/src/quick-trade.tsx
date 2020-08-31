import React, { useState, useEffect } from 'react';
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import SweetAlert from "react-bootstrap-sweetalert";
import { Urls } from "./constants";
import ApiCall from "./api";
import InputForm from "./input-form";
import { ILookupCall } from './interfaces';


export default function QuickTrade(rowData: any) {
    /* inline, single-field quicktrade form for users to buy/sell */
    /* we ALREADY KNOW that the given symbol from rowData is a valid stock
     * that is already owned by user, therefore we ONLY have to worry about 
     * the dang price */
    let [lookupPrice, setLookupPrice] = useState<number>(0);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();

  /* prevent stale purchase / sale requests by always fetching latest price */
     useEffect(() => {
      let payload: ILookupCall = {
        url: Urls.lookup,
        auth: true,
        body: {
          name: rowData.stock_symbol,
        },
      };
      ApiCall(payload).then((response:any) => {
      if (response.code) {
        enqueueSnackbar(response.message, { variant: "error" });
        setLookupPrice(0);
      }
       else {
        setLookupPrice(response.latestPrice);
       }
      })
     }, [])
    

     return (

        <>
        <h1>{rowData.stock_symbol}</h1>
        <h2>{lookupPrice}</h2>
        </>
     )

}