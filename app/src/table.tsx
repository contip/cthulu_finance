import React from "react";
import MaterialTable from "material-table";

export interface tableCol {
    title: string;
    field: string;
}

export default function Table(tableCols: Array<tableCol>|any, 
    data: Array<any>, title: string, options?: any) {

        
        console.log(options);
        return(
            <div className={title}>
                <MaterialTable
                options={{paging: false,
                    showSelectAllCheckbox: false,
                    search: false,
                    sorting: false}}
                columns={tableCols}
                data={data}
                title={title}
                />
            </div>
        )
    }



