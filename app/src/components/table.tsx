import React from "react";
import MaterialTable from "material-table";
import { ITableCol, IStockData, IUserHolding, IUserTransaction } from "../data/interfaces";
import { useLocation } from "react-router-dom";

/* creates material table with the given input props */
export default function Table(props: {
  tableCols: Array<ITableCol>;
  data: Array<IUserHolding | IStockData | IUserTransaction>;
  title: string;
  detailPanel?: Array<any>; /* detail panel options in form given by docs */
  options?: any; /* obj to hold desired options props as specified by docs */
}): JSX.Element {
    /* if call location is from /history route, disable clickable rows,
     * otherwise enable them for quicktrade */
  let location = useLocation();
  return (
    <div className={props.title}>
      <MaterialTable
        options={props.options}
        columns={props.tableCols}
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
  );
}
