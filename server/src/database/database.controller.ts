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


@Controller('trades') /* i.e. the URL the controller is handling */
export class DatabaseController {
  constructor(
    private tradesService: TradesService,
    private authService: AuthService,
  ) {}

  /* controller for purchases; sends incoming request to be validated, then
   * passes purchase data to Database Module to be added to db */
  @UseGuards(AuthGuard('jwt'))
  @Post('/buy')
  async handleBuy(@Request() req: any): Promise<userDto> {
    let tradeData = await this.authService.validateTrade(req);
    return this.tradesService.logPurchase(tradeData);
  }

  /* controller for sales; sends incoming request to be validated, then
   * passes sale data to Database Module to be added to db */
  @UseGuards(AuthGuard('jwt'))
  @Post('/sell')
  async handleSell(@Request() req: any): Promise<userDto> {
    /* send req to be validated then send to trades service to add to db */
    let tradeData = await this.authService.validateTrade(req);
    return this.tradesService.logSale(tradeData);
  }

  /* controller for retrieving user history / portfolio; validates request 
   * then passes data to Database Module where db query is performed */
  @UseGuards(AuthGuard('jwt'))
  @Post('/history')
  async test(@Request() req) {
    if (req.user.id != req.body['user_id']) {
      throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    }
    return await this.tradesService.getUserHistory(req.body['user_id']);
  }
}
