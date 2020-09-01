import React from "react";
import MaterialTable from "material-table";
import { tableCol } from "../data/interfaces";


export default function Table(props: {tableCols: Array<tableCol>|any, 
    data: Array<any>|any, title: string, detailPanel?: any, options?: any}) {
        return(
            <div className={props.title}>
                <MaterialTable
                options={props.options}
                columns={props.tableCols}
                data={props.data}
                title={props.title}
                detailPanel={props.detailPanel}
                />
            </div>
        )
    }
