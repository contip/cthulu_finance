import React from "react";
import MaterialTable from "material-table";
import { tableCol } from "../data/interfaces";
import {useLocation } from "react-router-dom";


export default function Table(props: {tableCols: Array<tableCol>|any, 
    data: Array<any>|any, title: string, detailPanel?: any, options?: any}) {
        let location = useLocation();
        return(
            <div className={props.title}>
                <MaterialTable
                options={props.options}
                columns={props.tableCols}
                data={props.data}
                title={props.title}
                detailPanel={props.detailPanel}
                onRowClick={location.pathname === "/history" ? undefined : (event, rowData, togglePanel: any) => togglePanel()}
                />
            </div>
        )
    }
