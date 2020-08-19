import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { TradesService } from './trades.service';
import { purchaseDto } from './interfaces/trades-dto.interface';
import { userDto } from './interfaces/user-dto.interface';
import { of } from 'rxjs';

@Controller('buy') /* i.e. the URL the controller is handling */
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  /* what is the return type of this?  boolean?  */
 async secret(@Body() body: Body) {
    /* send the buy request to the trades service for processing */
    /* perform basic validation here and then send purchase data to trades
        service */
    /* make sure when building POST requests to /buy, you include the
        following key:value pairs in the body:
        user_id: number, stock: string, shares: number */
    if (!body['user_id'] || !body['stock'] || !body['shares']) {
      return null;
    }
    let purchaseData: purchaseDto = {
      user_id: body['user_id'],
      stock: body['stock'],
      shares: body['shares'],
    };
   console.log(await this.tradesService.logPurchase(purchaseData));
      
      return await this.tradesService.logPurchase(purchaseData) };

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

