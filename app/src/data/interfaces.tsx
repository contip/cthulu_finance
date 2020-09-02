/* temp... */
export interface ILoginInput {
  username: string;
  password: string;
}

export interface ICallError {
  code: number;
  message: string;
}

export interface tableCol {
  title: string;
  field: string;
}

/* every call will need a url and boolean specifying whether or not to include
 * jwt authentication */
interface IApiCall {
  url: string;
  auth: boolean;
}

/* ===========auth controller=========== */
/* login, register, and available routes */
export interface IAuthCall extends IApiCall {
  body: { username: string; password?: string };
}


/* ===========trades controller=========== */
/* buy, sell, and history routes */
export interface ITradeCall extends IApiCall {
  body: {
    user_id: number;  /* required by /history */
    stock_symbol?: string;
    shares?: number;
  };
}

/* ===========lookup controller=========== */
/* lookup route */
export interface ILookupCall extends IApiCall {
  body: {
    name: string;
  }
}


/* responses from server */
/* ===========auth controller=========== */
/* response from available route is simple boolean */
/* response from login and register routes */
export interface IUser {
  accessToken: string;
  userData: IUserData;
}
    /* relies on... */
    export interface IUserData {
      id: number;
      username: string;
      cash: number;
      holdings: Array<IUserHolding | IUserHoldingFull> | [];  /* not included for register route */
    }

    export interface IUserHolding {
      stock_name: string;
      stock_symbol: string;
      shares: number;
    }

    export interface IUserHoldingFull extends IUserHolding {
      price: number;
      value: number;
    }

/* ===========trades controller=========== */
/* buy, sell, and history routes */

/* buy and sell routes return IUserData */

/* history route */
export interface IUserTransaction {
  date: string;
  stock_name: string;
  stock_symbol: string;
  price: number;
  shares: number;
  total: number;
}

/* ===========lookup controller=========== */
/* lookup route */
export interface IStockData {
  companyName: string;
  symbol: string;
  latestPrice: number;
  previousClose?: number;
  low?: number;
  lowTime?: string;
  high?: number;
  highTime?: string;
  week52Low?: number;
  week52High?: number;
  [key: string]: string | number | undefined;
}