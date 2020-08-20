import { Trades } from "../entities/trades.entity";

/* the form of the data that will be passed when interacting with the users
 *  db.  the id field is probably unnecessary since it's auto-generated! */
export interface userDto {
    id?: number;
    username: string;
    hash: string;
    cash?: number;
    holdings?: Trades[] | Array<{ stock_name: string, name: string }>;
    transactions?: Trades[] | Array<{ 
        transaction_price: number,
        stock_symbol: string,
        stock_name: string,
        stock_price: number,
        shares: number,
        date: Date | string 
    }>;
}