import { Injectable, HttpService, HttpException, HttpStatus } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_KEY } from './constants';


@Injectable()
export class LookupService {
  constructor(private http: HttpService) {}

  /* validates input string then submits as query to stock quote api
   * returns response as an observable */
  async get_quote(symbol: string): Promise<Observable<object>> {
    /* input string must be 1 to 4 chars long and only consist of 
            alphabetical letters (case insensitive) */
    if (
      !symbol ||
      symbol.length == 0 ||
      symbol.length > 4 ||
      !/^[a-zA-Z]+$/.test(symbol)
    ) {
      throw new HttpException('Invalid Request!', HttpStatus.BAD_REQUEST);
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
