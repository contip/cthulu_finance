import { Injectable, HttpModule, HttpService, Get, Body, Res } from "@nestjs/common";
import { map } from 'rxjs/operators';

let API_KEY = "pk_3646d2b2860044c2b185c3c2bda19703";


@Injectable()
export class LookupService{
    constructor(private http: HttpService) {}
    get_quote(symbol: string): any {
        console.log('https://cloud.iexapis.com/stock/' + symbol + '/quote?token=' + API_KEY);
        return this.http.get('https://cloud-sse.iexapis.com/stable/stock/' + symbol + '/quote?token=pk_3646d2b2860044c2b185c3c2bda19703')
            .pipe(
                map(response => response.data)
            );
        // var value;
        // for(var propname in a) {
        //     value = a[propname]
        //     console.log(propname, value);
        }
    }
