import {
  Injectable,
  HttpModule,
  HttpService,
  Get,
  Body,
  Res,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

let API_KEY = 'pk_3646d2b2860044c2b185c3c2bda19703';

@Injectable()
export class LookupService {
  constructor(private http: HttpService) {}

  /* when called with string representing stock symbol to look up, submits
   *  API request to stock prices service, returns the mapped response */
  get_quote(symbol: string): Observable<string> {
    /* input string must be 1 to 4 chars long and only consist of 
            alphabetical letters (case insensitive) */
    if (
      !symbol ||
      symbol.length == 0 ||
      symbol.length > 4 ||
      !/^[a-zA-Z]+$/.test(symbol)
    ) {
      return null;
    }

    return this.http
      .get(
        'https://cloud-sse.iexapis.com/stable/stock/' +
          symbol +
          '/quote?token=' +
          API_KEY,
      )
      .pipe(map(response => response.data));
  }
}
