import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trades } from './entities/trades.entity';
import { tradesDto, tradeInputDto } from './interfaces/trades-dto.interface';
import { userDto, portfolioDto } from './interfaces/user-dto.interface';
import { UserService } from './user.service';
import { LookupService } from 'src/lookup/lookup.service';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trades)
    private tradesRepository: Repository<Trades>,
    private userService: UserService,
    private lookupService: LookupService,
  ) {}

  /* handles entering given stock purchase information in the trades db
   * returns the user after the updates to their holdings and cash, otherwise
   * throws HtmlException */
  async logPurchase(purchaseData: tradeInputDto): Promise<userDto> {
    /* get and validate user and stock data */
    let userData = await this.getUserById(purchaseData.user_id);
    let stockData = await this.getStockData(purchaseData.stock_symbol);
    if (
      !userData ||
      !stockData ||
      !stockData['symbol'] ||
      stockData['shares'] <= 0 ||
      stockData['symbol'] != purchaseData.stock_symbol
    ) {
      throw new HttpException('Invalid Request!', HttpStatus.BAD_REQUEST);
    }
    /* validate the purchase before making db changes */
    let transaction_price: number =
      purchaseData.shares * stockData['latestPrice'];
    if (!transaction_price || userData.cash - transaction_price < 0) {
      throw new HttpException('Not Enough Cash!', HttpStatus.BAD_REQUEST);
    }
    /* build object to pass to trades database (tradesDto) */
    let tradeData: tradesDto | any = {
      user_id: userData.id,
      transaction_price: transaction_price,
      stock_symbol: purchaseData.stock_symbol,
      stock_name: stockData['companyName'],
      stock_price: stockData['latestPrice'],
      shares: purchaseData.shares,
      date: new Date(),
    };
    /* add the trade to the trades db */
    await this.tradesRepository.save(tradeData);
    /* update user's cash */
    userData.cash = userData.cash - transaction_price;
    await this.updateUser(userData);
    /* get updated user info and return it */
    return await this.getUserById(purchaseData.user_id);
  }

  /* handles entering given stock salae information in the trades db
   * returns the user after the updates to their holdings and cash, otherwise
   * throws HtmlException */
  async logSale(saleData: tradeInputDto): Promise<userDto> {
    /* get and validate user and stock data */
    let userData = await this.getUserById(saleData.user_id);
    let stockData = await this.getStockData(saleData.stock_symbol);
    if (
      !userData ||
      !userData.holdings ||
      userData.holdings.length == 0 ||
      !stockData ||
      !stockData['symbol'] ||
      stockData['symbol'] != saleData.stock_symbol
    ) {
      throw new HttpException('Invalid Request!', HttpStatus.BAD_REQUEST);
    }
    let userShares: number, i: number;
    /* make sure user has enough shares of given stock */
    for (i = 0; i < userData.holdings.length; i++) {
      if (saleData.stock_symbol === userData.holdings[i]['stock_symbol']) {
        userShares = userData.holdings[i].shares;
        break; // indexing variable can be used later to access holdings
      }
    }
    if (!userShares || userShares < saleData.shares) {
      throw new HttpException('Not Enough Shares!', HttpStatus.BAD_REQUEST);
    }
    /* build object to pass to trades db */
    let tradeData: tradesDto | any = {
      user_id: userData.id,
      transaction_price: saleData.shares * (await stockData['latestPrice']),
      stock_symbol: saleData.stock_symbol,
      stock_name: await stockData['companyName'],
      stock_price: await stockData['latestPrice'],
      shares: -saleData.shares /* negate shares to indicate a sale */,
      date: new Date(),
    };
    /* add trade to db */
    await this.tradesRepository.save(tradeData);
    /* update user's cash, decrement their shares */
    userData.cash = userData.cash + tradeData.transaction_price;
    userData.holdings[i].shares -= saleData.shares;
    /* if shares have reduced to 0, remove item from holdings */
    if (userData.holdings[i].shares == 0) {
      userData.holdings.splice(i, 1);
    }
    await this.updateUser(userData);
    /* get updated user info and return it */
    return await this.getUserById(saleData.user_id);
  }

  /* following are helper functions that call on providers of other modules */

  /* calls appropriate method in users service to get transaction history 
   * from users table as an array of objects*/
  getUserHistory = async (user_id: number): Promise<Array<portfolioDto>> => {
    return await this.userService.getTransactionsById(user_id);
  };

  /* calls appropriate method in users service to get all user data from users
   * table, plus holdings */
  getUserById = async (user_id: number): Promise<userDto> => {
    return await this.userService.findByIdFull(user_id);
  };

  /* calls on the lookup module to get current quote for given stock symbol */
  getStockData = async (symbol: string): Promise<object> => {
    /* lookup service returns observable, so return it as a promise */
    return (await this.lookupService.get_quote(symbol)).toPromise();
  };

  /* calls createUser method of user module to update given user with 
   * new data provided in input object*/
  updateUser = async (newUserData: userDto): Promise<object | null> => {
    return await this.userService.createUser(newUserData);
  };
}
