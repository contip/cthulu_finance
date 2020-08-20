import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trades } from './entities/trades.entity';
import { tradesDto, tradeInputDto } from './interfaces/trades-dto.interface';
import { userDto } from './interfaces/user-dto.interface';
import { async, of, interval, Observable } from 'rxjs';
import { UserService } from './user.service';
import { LookupService } from 'src/lookup/lookup.service';
import { AuthGuard } from '@nestjs/passport';
import { concatMap, delay, take } from 'rxjs/operators';
import { use } from 'passport';
/* need an import for DTO??  what DTO u using for trades ? */

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trades)
    private tradesRepository: Repository<Trades>,
    private userService: UserService,
    private lookupService: LookupService,
  ) {}

  logPurchase = async (purchaseData: tradeInputDto): Promise<userDto> => {
    /* already verified that purchaseData input has user_id, stock, and shares
      datamembers */

    /* get user data */
    let userData = await this.getUserID(purchaseData.user_id);
    if (!userData) {
      return null;
    }
    /* get stock data */
    let stockData = await this.getStockData(purchaseData.stock);
    if (
      !stockData ||
      !(await stockData['symbol']) ||
      (await stockData['symbol']) != purchaseData.stock
    ) {
      return null;
    }
    /* validate the purchase before making db changes */
    let transaction_price: number =
      purchaseData.shares * (await stockData['latestPrice']);
    if (userData.cash - transaction_price < 0) {
      return null;
    }
    /* build object to pass to trades database (tradesDto) */
    let tradeData: tradesDto | any = {
      user_id: userData.id,
      transaction_price: transaction_price,
      stock_symbol: purchaseData.stock,
      stock_name: await stockData['companyName'],
      stock_price: await stockData['latestPrice'],
      shares: purchaseData.shares,
      date: new Date(),
    };
    /* add the trade to the trades db */
    await this.tradesRepository.save(tradeData);
    /* update user's cash in users table */
    userData.cash = userData.cash - transaction_price;
    await this.updateUser(userData);
    /* get updated user info and return it */
    console.log(await this.getUserID(purchaseData.user_id));
    return await this.getUserID(purchaseData.user_id);
  };

  /* BEFORE YOU CAN IMPLEMENT logSale, YOU MUST HAVE A METHOD TO RETURN A 
    USER'S HOLDINGS / PORTFOLIO */
  logSale = async (saleData: tradeInputDto): Promise<userDto> => {
    /* already verified that purchaseData input has user_id, stock, and shares
      datamembers */

    /* get user data */
    let userData = await this.getTotalUserID(saleData.user_id);
    if (!userData || !userData.holdings || userData.holdings.length === 0) {
      /* these should return errors... */
      return null;
    }

    let userShares: number;
    /* make sure user has enough shares of given stock */
    for (let i = 0; i < userData.holdings.length; i++) {
      if (saleData.stock === userData.holdings[i]['stock_symbol']) {
        userShares = userData.holdings[i]['COUNT(stock_name)'];
        break;
      }
    }
    if (!userShares || userShares < saleData.shares) {
      /* this should return a specific error */
      return null;
    }
    /* get stock data */
    let stockData = await this.getStockData(saleData.stock);
    if (
      !stockData ||
      !(await stockData['symbol']) ||
      (await stockData['symbol']) != saleData.stock
    ) {
      return null;
    }
    /* build object to pass to trades db */
    let tradeData: tradesDto | any = {
      user_id: userData.id,
      transaction_price: saleData.shares * await stockData['latestPrice'],
      stock_symbol: saleData.stock,
      stock_name: await stockData['companyName'],
      stock_price: await stockData['latestPrice'],
      shares: -saleData.shares,  /* set shares to negative to show sale */
      date: new Date(),
    };
    /* add trade to db */
    await this.tradesRepository.save(tradeData);
    /* update user's cash, decrement their shares */
    userData.cash = userData.cash + tradeData.transaction_price;
    await this.updateUser(userData);
    /* get updated user info and return it */
    console.log(await this.getUserID(saleData.user_id));
    return await this.getTotalUserID(saleData.user_id);
    /* get updated user info and return it */

    return;
  };

  getUserHoldings = async (user_id: number) => {
    return await this.userService.totalFindOneID(user_id);
  };

  /* helpers */

  getTotalUserID = async (user_id: number): Promise<userDto> => {
    return await this.userService.totalFindOneID(user_id);
  };

  getUserID = async (user_id: number): Promise<userDto> => {
    return await this.userService.findOneID(user_id);
  };

  /* make sure to change promise type */
  /* lookupservice get_quote function returns an observable, so we return that
  converted to a promise */
  getStockData = async (symbol: string): Promise<object> => {
    return (await this.lookupService.get_quote(symbol)).toPromise();
  };

  updateUser = async (newUserData: userDto): Promise<object | null> => {
    return await this.userService.createUser(newUserData);
  };
}

//logSale
//   createUser = async (regDto) => {
//     return await this.userRepository.save(regDto);
//   };

//   findAll(): Promise<UserEntity[]> {
//     return this.userRepository.find();
//   }
