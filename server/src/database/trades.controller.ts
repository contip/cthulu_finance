import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { TradesService } from './trades.service';

@Controller('buy')  /* i.e. the URL the controller is handling */
export class TradesController {
  constructor(private tradesService: TradesService,) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  /* what is the return type of this?  boolean?  */
  secret(@Body() body: Body): any {
      /* send the buy request to the trades service for processing */
    return this.tradesService.logPurchase(body);
  }

  // // @UseGuards(AuthGuard('local'))
  // @Post('/register')
  // async register(@Request() req) {
  //     if (req.body.username != '' && req.body.hash === '')
  //     {
  //         console.log('we has receive a request with only the username')
  //         return this.authService.regLookup(req.body.username)

  //     }
  //     else {
  //         this.authService.registerUser(req.body);
  //         return this.authService.login(req.body)
  //     }
  // }
}
