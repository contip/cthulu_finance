import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class LookupService {
  constructor(private http: HttpService) {}

  /* submits input string (assumed legal string of 4 chars or less) to
   * external lookup service, returns response as an observable, otherwise
   * not found exception */
  async get_quote(symbol: string) {
    let response = this.http.get(
      "https://query1.finance.yahoo.com/v7/finance/options/" + symbol
    );
    return response.pipe(
      map((response) => {
        return {
          latestPrice:
            response.data.optionChain.result[0].quote.regularMarketPrice,
          companyName: response.data.optionChain.result[0].quote.shortName,
          symbol: response.data.optionChain.result[0].quote.symbol,
        };
      }),
      catchError((err) => {
        throw new HttpException(
          "Not Found / Invalid Stock Symbol",
          HttpStatus.BAD_REQUEST
        );
      })
    );
  }
}
