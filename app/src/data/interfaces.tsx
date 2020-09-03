/* input-form component */
export interface IForm {
  onSubmit: (event: React.FormEvent<any>) => void;
  inputs: Array<IFormInput>;
  buttonValidators: Array<boolean>;
}

export interface IFormInput {
  label: string;
  value: string;
  type?: string | undefined;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void /* function to update the state of input field */;
  name: string;
  validatorListener: (isValid: boolean) => void | undefined;
  validators: Array<string>;
  errorMessages: Array<string>;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void | undefined;
}

export interface ITradeProps {
  stock_symbol: string,
  stock_name: string,
  type?: string,
  latestPrice: number,
  shares?: number,
}

export interface ICallError {
  code: number;
  message: string;
}

/* table component, column format */
export interface ITableCol {
  title: string;
  field: string;
  width?: number;
  type?: string;
}

/* ========= api calls to server ========= */
interface IApiCall {
  url: string;
  auth: boolean;
}

/* auth controller */
export interface IAuthCall extends IApiCall {
  body: { username: string; password?: string };
}

/* trades controller */
export interface ITradeCall extends IApiCall {
  body: {
    user_id: number;
    stock_symbol?: string;
    shares?: number;
  };
}

/* lookup controller */
export interface ILookupCall extends IApiCall {
  body: {
    name: string;
  };
}

/* ========= server responses to api calls ========= */
/* auth controller */

/* top-level user data type with auth token */
export interface IUser {
  accessToken: string;
  userData: IUserData;
}

export interface IUserData {
  id: number;
  username: string;
  cash: number;
  holdings:
    | Array<IUserHolding | IUserHoldingFull>
    | [] /* not included for register route */;
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

/* trades controller */
export interface IUserTransaction {
  date: string;
  stock_name: string;
  stock_symbol: string;
  price: number;
  shares: number;
  total: number;
}

/* lookup controller */
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
