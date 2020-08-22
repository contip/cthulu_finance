/* the form of the data that will be passed when interacting with the users
 *  db */
export interface userDto {
  id?: number;
  username: string;
  hash?: string;
  cash?: number;
  holdings?: Array<holdingDto>;
  transactions?:Array<portfolioDto>;
}

export interface holdingDto {
    stock_name: string;
    stock_symbol: string;
    shares: number;
}

export interface portfolioDto {
    date: Date | string;
    stock_symbol: string;
    stock_name: string;
    stock_price: number;
    shares: number;
    transaction_price: number;
}