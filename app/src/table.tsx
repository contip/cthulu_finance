import React from "react";
import MaterialTable from "material-table";

export interface tableCol {
    title: string;
    field: string;
}

export default function Table(tableCols: Array<tableCol>|any, 
    data: Array<any>|any, title: string, options?: any) {

        
        // console.log(options);
        console.log('the tableCols array i received is:', tableCols);
        console.log('the data array i received is:', data);
        return(
            <div className={title}>
                <MaterialTable
                options={options}
                columns={tableCols}
                data={data}
                title={title}
                />
            </div>
        )
    }



