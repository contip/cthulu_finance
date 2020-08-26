import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { API_KEY } from './constants';

@Injectable()
export class LookupService {
  constructor(private http: HttpService) {}

  /* validates input string then submits as query to stock quote api
   * returns response as an observable */
  async get_quote(symbol: string) {
    /* input string must be 1 to 4 chars long and only consist of 
            alphabetical letters (case insensitive) */
    let response = this.http.get(
      'https://cloud-sse.iexapis.com/stable/stock/' +
        symbol +
        '/quote?token=' +
        API_KEY,
    );
    /* TODO: better error handling for the returned observable */
    // if (!response) {
    //   throw new HttpException(
    //     'Error contacting quote service!',
    //     HttpStatus.SERVICE_UNAVAILABLE,
    //   );
    // }
    return response.pipe(
      map(response => response.data),
      catchError(err => {
        throw new HttpException(
          'Not Found / Invalid Stock Symbol',
          HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }
}
