import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { TradesService } from './trades.service';
import { tradeInputDto } from './interfaces/trades-dto.interface';
import { userDto } from './interfaces/user-dto.interface';
import { of } from 'rxjs';

@Controller('trades') /* i.e. the URL the controller is handling */
export class TradesController {
  constructor(private tradesService: TradesService,
    private authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/buy')
  /* what is the return type of this?  boolean?  */
  async handleBuy(@Request() req): Promise<userDto> {
    /* send the buy request to the trades service for processing */
    /* perform basic validation here and then send purchase data to trades
        service */
    /* make sure when building POST requests to /buy, you include the
        following key:value pairs in the body:
        user_id: number, stock: string, shares: number */
    // if (
    //   !(req.body['user_id'] && req.body['stock_symbol'] && req.body['shares'])
    // ) {
    //   throw new HttpException(
    //     'Invalid Request!',
    //     HttpStatus.EXPECTATION_FAILED,
    //   );
    // }
    // if (req.body['user_id'] != req.user.id) {
    //   console.log(
    //     'user id:',
    //     req.user.id,
    //     ' (jwt) is attempting to make',
    //     'changes to user id:',
    //     req.body['user_id'],
    //   );

    //   throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    // }
    // let purchaseData: tradeInputDto = {
    //   user_id: req.body['user_id'],
    //   stock_symbol: req.body['stock_symbol'],
    //   shares: req.body['shares'],
    // };
    //console.log(await this.tradesService.logPurchase(purchaseData));

    /* make sure user issuing request has JWT that matches the username / id */
    let tradeData = await this.authService.validateTrade(req);
    return this.tradesService.logPurchase(tradeData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/sell')
  async handleSell(@Request() req): Promise<userDto> {
    // if (
    //   !(req.body['user_id'] && req.body['stock_symbol'] && req.body['shares'])
    // ) {
    //   throw new HttpException(
    //     'Invalid Request!',
    //     HttpStatus.EXPECTATION_FAILED,
    //   );
    // }
    // if (req.body['user_id'] != req.user.id) {
    //   console.log(
    //     'user id:',
    //     req.user.id,
    //     ' (jwt) is attempting to make',
    //     'changes to user id:',
    //     req.body['user_id'],
    //   );
    //   throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    // }
    // let saleData: tradeInputDto = {
    //   user_id: req.body['user_id'],
    //   stock_symbol: req.body['stock_symbol'],
    //   shares: req.body['shares'],
    // };
    // console.log(
    //   'i should be calling logSale in tradesService with this saleData:',
    //   saleData,
    // );
    let tradeData = await this.authService.validateTrade(req);
    return this.tradesService.logSale(tradeData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/history')
  async test(@Request() req) {
    if (req.user.id != req.body['user_id']) {
      throw new HttpException("Unauthorized!", HttpStatus.UNAUTHORIZED);
    }
    return await this.tradesService.getUserHistory(req.body['user_id']);
    // console.log('MY DUDE, VALIDATE JWT SHIT GIVES ME:', req.user);
    // return this.tradesService.getUserHistory(req.body['user_id']);
  }
}
