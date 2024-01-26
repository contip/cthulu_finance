import React from "react";
import MaterialTable from "material-table";
import {
  ITableCol,
  IStockData,
  IUserHolding,
  IUserTransaction,
} from "../data/interfaces";
import { useLocation } from "react-router-dom";

/* creates material table with the given input props */
/* currently throws warning: "React does not recognize the 'scrollWidth' prop
 * on a DOM element" (bug with material ui table, see:
 * https://github.com/mbrn/material-table/issues/2370) */
export default function Table(props: {
  tableCols?: Array<ITableCol>;
  data?: Array<IUserHolding | IStockData | IUserTransaction>;
  title?: string;
  detailPanel?: Array<any> /* detail panel options in form given by docs */;
  options?: any /* obj to hold desired options props as specified by docs */;
}): JSX.Element {
  /* if call location is from /history route, disable clickable rows,
   * otherwise enable them for quicktrade */
  let location = useLocation();
  return props && props.tableCols && props.data && props.title ? (
    <div className={props.title}>
      <MaterialTable
        options={{ ...props.options, ...{ showTitle: false, toolbar: false } }}
        columns={props.tableCols as any}
        data={props.data}
        title={props.title}
        detailPanel={props.detailPanel}
        onRowClick={
          location.pathname === "/history"
            ? undefined
            : (event, rowData, togglePanel: any) => togglePanel()
        }
      />
    </div>
  ) : (
    <></>
  );
}
