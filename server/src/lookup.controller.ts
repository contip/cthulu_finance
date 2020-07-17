import { Controller, Post, Get, Body, Req } from "@nestjs/common";
import { LookupService } from "./lookup.service";
import { AppService } from "./app.service"


@Controller('lookup')
export class LookupController {
    constructor(private readonly lookupService: LookupService,
        private readonly appService: AppService) {}

    @Post()
    get_quote(@Body() body: Body): string {
        console.log(body)
        const lookup_symbol = body['name'];
        return this.lookupService.get_quote(lookup_symbol);
    }

    @Get()
    get_hello(): string {
        return this.appService.getHello();
    }
    

}