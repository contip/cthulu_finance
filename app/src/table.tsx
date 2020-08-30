import React from "react";
import MaterialTable from "material-table";

export interface tableCol {
    title: string;
    field: string;
}

export default function Table(props: {tableCols: Array<tableCol>|any, 
    data: Array<any>|any, title: string, detailPanel?: any, options?: any}) {
        
        // console.log(options);
        // console.log('the tableCols array i received is:', props.tableCols);
        console.log('(table component) - the data array i received is:', props.data);
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



