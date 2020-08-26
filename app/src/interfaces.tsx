/* TODO: also define an interface for user objects (i.e. exactly what is stored
 * in localstorage), and put them in a separate interfaces file/folder */

export interface IUser {
  accessToken: string;
  userData: IUserData;
}

export interface IUserData {
  id: number;
  username: string;
  cash: number;
  holdings: Array<IUserHolding>;
}

export interface IUserHolding {
  stock_name: string;
  stock_symbol: string;
  shares: number;
  price: number;
  value: number;
}
