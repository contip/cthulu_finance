import { Injectable, HttpModule, HttpService, Get, Body, Res } from "@nestjs/common";
import { map } from 'rxjs/operators';

let API_KEY = "pk_3646d2b2860044c2b185c3c2bda19703";


@Injectable()
export class LookupService{
    constructor(private http: HttpService) {}
    
    /* when called with string representing stock symbol to look up, submits 
     *  API request to stock prices service, returns the mapped repose */
    get_quote(symbol: string): any {
        console.log('https://cloud-sse.iexapis.com/stable/stock/' + symbol + 
        '/quote?token=' + API_KEY);
        return this.http.get('https://cloud-sse.iexapis.com/stable/stock/' +
        symbol + '/quote?token=' + API_KEY)
            .pipe(
                map(response => response.data)
            );
        }
    }
