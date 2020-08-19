/* the form of the data that will be passed when interacting with the trades
 *  db */ 
export interface tradesDto {
    trade_id: number;
    user_id: number;
    transaction_price: number;
    stock: string;
    stock_price: number;
    shares: number;
    date: Date;
}

export interface purchaseDto {
    user_id: number;
    stock: string;
    shares: number;
}