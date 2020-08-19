import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { LookupService } from "./lookup.service";
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from "src/auth/auth.service";
import { JwtStrategy } from "../auth/jwt.strategy";
import { Observable } from "rxjs";

@Controller('lookup')
export class LookupController {
    constructor(private readonly lookupService: LookupService, authService: AuthService,
        ) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    /* if a POST req sent to /lookup, gets lookup name from req body and sends 
     *  to get_quote function (part of lookup.service) */
    /* must include checks for illegal inputs (blank name fields, additional
        random fields in the body of the post, etc) */
    async get_quote(@Body() body: Body): Promise<Observable<object>> {
        console.log(body)
        const lookup_symbol = body['name'];
        return this.lookupService.get_quote(lookup_symbol);
    }

}