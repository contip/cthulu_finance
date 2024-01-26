import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { map, catchError } from "rxjs/operators";
import TickerSymbols from "./lookup.companies";

@Injectable()
export class LookupService {
  constructor(private http: HttpService) {}

  /* submits input string (assumed legal string of 4 chars or less) to
   * external lookup service, returns response as an observable, otherwise
   * not found exception */
  async get_quote(symbol: string) {
    let response = this.http.get(
      process.env.LOOKUP_URL + "quote?symbol=" + symbol,
      {
        headers: { "X-Finnhub-Token": process.env.API_KEY },
      }
    );
    return response.pipe(
      map((response) => {
        let quote = response.data;
        if (!quote.c || quote.c === 0) throw new Error();
        let name = TickerSymbols.find(
          (e) => e.symbol.toLowerCase() === symbol.toLowerCase()
        )?.name ?? symbol;
        return {
          latestPrice: quote.c,
          companyName: name,
          symbol: symbol,
          previousClose: quote.pc,
          low: quote.l,
          high: quote.h,
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
