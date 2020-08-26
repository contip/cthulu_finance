import React, {
  ReactElement,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { authService } from "./auth.service";
import { IUserHolding, IUserData } from "./interfaces";
/* i shouldn't be directly linking css file like this... right? */
import BootstrapTable from "react-bootstrap-table-next";
import LookupApi, { stockData } from "./lookup-api";
import Table, { tableCol } from "./table";
import { HoldingsColumnsMap } from "./constants";

export function Home(user: any) {
  let [userData, setUserData] = useState<IUserData>(user);
  let [userHoldings, setUserHoldings] = useState<Array<IUserHolding>>([{stock_name: "", stock_symbol: "", shares: 0, price: 0, value: 0}]);
  let [searching, setSearching] = useState<boolean>(false);
  let [okayRender, setOkayRender] = useState<boolean>(false);


  useEffect(() => {
    let mounted = true;
    if (!searching) {
      bulkLookup(userData.holdings).then(updatedArray => {
        if (mounted){
          console.log('updated array i received is', updatedArray);
        setUserHoldings(updatedArray)
        setSearching(false);
      }})
    }
    return () => {
      mounted = false;
      setOkayRender(true);
      //setSearching(false);
    }
  }, [userHoldings])

    function buildProps() {
    /* table columns */
    if (userData && userHoldings && userHoldings.length > 0 && !searching) {
      const tableCols: Array<tableCol> = [];
      Object.keys(HoldingsColumnsMap).forEach((key) => {
        if (key != 'tableData') {
        tableCols.push({ title: HoldingsColumnsMap[key], field: key });
      }});
      const props = {
        tableCols: tableCols,
        data: userHoldings,
        title: userData.username,
        options: {
          paging: false,
          showSelectAllCheckbox: false,
          search: false,
          sorting: false,
          isLoading: true,
        },
      };
      
      //console.log(userHoldings);
      console.log('i am sending the following data array to table:', props.data);
      console.log('the props object is', props);
      console.log('stringified version of data is', JSON.stringify(props.data), 'the non-strigified version is', props.data);
      
      return Table(props.tableCols, props.data, props.title, props.options);
    }

  }

    console.log('user holdings are', userHoldings);

  async function bulkLookup(holdingsArray: Array<IUserHolding>) {
    if (holdingsArray && holdingsArray.length > 0) {
      holdingsArray.forEach(async (holding) => {
        LookupApi(holding.stock_symbol).then((response: stockData) => {
        holding.price = response.latestPrice;
        holding.value = holding.shares * holding.price;
        })
      });
    }
    return holdingsArray;
  }

// const cols: Array<tableCol> = [];
// Object.keys(HoldingsColumnsMap).forEach((key) => {
//   cols.push({ title: HoldingsColumnsMap[key], field: key });
// });

// const data = [{ stock_name: "ADT, Inc.", stock_symbol: "ADT", shares: 262, price: 11.62, value: 2950.12},
//  {stock_name: "The Coca-Cola Co.", stock_symbol: "KO", shares: 98, price: 47.91, value: 4695.18}]


return(
  <>
<div>{okayRender  && buildProps()}
{console.log("state of userHoldings is", userHoldings && userHoldings[0])}
</div>
{/* <div>
  {Table(cols, data, 'bung')}
</div> */}
</>)

}


 