/* form of data that will be passed as inputs to the buy and sell routes */
export interface buySellDto {
    user_id: number;
    stock_symbol: string;
    shares: number;
}