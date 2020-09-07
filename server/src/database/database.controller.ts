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
import { userDto } from './interfaces/user-dto.interface';

@Controller('trades')
export class DatabaseController {
  constructor(
    private tradesService: TradesService,
    private authService: AuthService,
  ) {}

  /* /buy controller sends incoming request to be validated, then
   * passes purchase data to trades service to be added to db */
  @UseGuards(AuthGuard('jwt'))
  @Post('/buy')
  async handleBuy(@Request() req: any): Promise<userDto> {
    let tradeData = await this.authService.validateTrade(req);
    return this.tradesService.logPurchase(tradeData);
  }

  /* /sell controller sends incoming request to be validated, then
   * passes sale data to trades service to be added to db */
  @UseGuards(AuthGuard('jwt'))
  @Post('/sell')
  async handleSell(@Request() req: any): Promise<userDto> {
    let tradeData = await this.authService.validateTrade(req);
    return this.tradesService.logSale(tradeData);
  }

  /* /history controller for transaction history validates request
   * then passes data to trades service where db query is performed */
  @UseGuards(AuthGuard('jwt'))
  @Post('/history')
  async handleHistory(@Request() req) {
    if (req.user.id != req.body['user_id']) {
      throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    }
    return await this.tradesService.getUserHistory(req.body['user_id']);
  }
}
