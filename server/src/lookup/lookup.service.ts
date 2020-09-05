import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class LookupService {
  constructor(private http: HttpService) {}

  /* submits input string (assumed legal string of 4 chars or less) to
   * external lookup service, returns response as an observable, otherwise
   * not found exception */
  async get_quote(symbol: string) {
    let response = this.http.get(
      'https://cloud-sse.iexapis.com/stable/stock/' +
        symbol +
        '/quote?token=' +
        process.env.API_KEY,
    );
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
