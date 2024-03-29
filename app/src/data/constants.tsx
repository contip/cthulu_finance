/* column names for all data fields used as columns in tables */
export const LookupColumnsMap: any = {
        companyName: "Company Name",
        symbol: "Trade Symbol",
        latestPrice: "Current Price",
        previousClose: "Last Closing Price",
        low: "24h Low Price",
        high: "24h High Price",
}

export const HoldingsColumnsMap: any = {
        stock_name: "Stock Name",
        stock_symbol: "Stock Symbol",
        shares: "Shares Owned",
        price: "Current Price",
        value: "Total",
}

export const HistoryColumnsMap: any = {
        date: "Transaction Date",
        stock_name: "Stock Name", 
        stock_symbol: "Stock Symbol",
        stock_price: "Price at Transaction Time",
        shares: "Shares",
        transaction_price: "Total Transaction Amount",
}

/* backend routes (set server url in env variables or proxy to localhost) */
export const Urls = {
        login: "auth/login",
        register: "auth/register",
        available: "auth/available",
        buy: "trades/buy",
        sell: "trades/sell",
        history: "trades/history",
        lookup: "lookup",
        users: "auth/users",
}