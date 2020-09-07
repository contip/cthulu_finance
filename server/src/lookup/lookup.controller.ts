import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LookupService } from './lookup.service';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Controller('lookup')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  /* /lookup controller for stock quotes; looks for 'name' field in
   * request body */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async get_quote(@Body() body: Body): Promise<Observable<object>> {
    return this.lookupService.get_quote(body['name'].toUpperCase());
  }
}
