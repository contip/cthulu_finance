import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trades } from './entities/trades.entity';
import { tradesDto, purchaseDto } from './interfaces/trades-dto.interface';
import { userDto } from './interfaces/user-dto.interface';
import { async, of, interval } from 'rxjs';
import { UserService } from './user.service';
import { LookupService } from 'src/lookup/lookup.service';
import { AuthGuard } from '@nestjs/passport';
import { concatMap, delay, take } from 'rxjs/operators';
/* need an import for DTO??  what DTO u using for trades ? */

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trades)
    private tradesRepository: Repository<Trades>,
    private userService: UserService,
    private lookupService: LookupService,
  ) {}

  logPurchase = async (purchaseData: purchaseDto): Promise<userDto> => {
    /* validate the input data */
    /* input data will be a stock name, number of shares, user_id */
    /* check that given user_id is actually a user in the system */
    let user: userDto = await this.userService.findOneID(purchaseData.user_id);
    if (!user || !user.id || !user.cash) {
      console.log("return triggered by no user or missing user props");
      return null;
    }
    /* check that the stock name is valid and store the price info */
    let price: number, stock_name: string;
    let stockObs = await this.lookupService.get_quote(purchaseData.stock);
    if (!stockObs) {
      console.log("return triggered by the observable not being set");
      return null;
    }
    await stockObs.toPromise().then(async response => {
      /* if the response stock symbol != input symbol or dne, invalid */
      //console.log(response);
      if (
        !response['symbol'] ||
        response['symbol'].toLowerCase() !== purchaseData.stock.toLowerCase()
      ) {
        /* set the input symbol to null to be caught by later check */
        console.log("return triggered by symbol not being equal or not found");
        return null;
      } else {
        price = response['latestPrice'];
        stock_name = response['companyName'];
      }
      /* determine purchase price */
      let transaction_price: number = purchaseData.shares * price;
      /* if user can't cover purchase, return null */
      if (!user.cash || user.cash - transaction_price < 0) {
        console.log("return triggered by no user cash or not enough cash");
        return null;
      }

      /* user is validated and has enough money to cover purchase */
      /* add purchase to trades repository */
      //console.log('price is: ', price);
      let tradeData: object = {
        user_id: user.id,
        transaction_price: transaction_price,
        stock_symbol: purchaseData.stock,
        stock_name: stock_name,
        stock_price: price,
        shares: purchaseData.shares,
        date: new Date() /* gets date in suitable format for database */
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
      };
      //console.log(tradeData);
      await this.tradesRepository.save(tradeData);
      /* subtract purchase amount from user cash */
      await this.userService.createUser({
        id: user.id,
        cash: user.cash - transaction_price,
      });
     // console.log('======result of findoneID on userid is:==========');
     // console.log(await this.userService.findOneID(purchaseData.user_id));
      //return {bung: "work"};
      let bung = await this.userService.findOneID(purchaseData.user_id);
      console.log(bung);
      return await bung;
    });

    /* (possibly) add purchase details to user dto */
    //return await this.tradesRepository.save(purchaseData);
  };

  //logSale
  //   createUser = async (regDto) => {
  //     return await this.userRepository.save(regDto);
  //   };

  //   findAll(): Promise<UserEntity[]> {
  //     return this.userRepository.find();
  //   }

  /* when user types username into registration field, it will automatically
   * call this function to see if a user with that name already exists in DB
   * if so, returns that user
   * if not, returns simple key value pair VALID: VALID
   */
  //   async findOne (username: string): Promise<userDto> {
  //     return await this.userRepository.findOne({ username: username }) || { id: -1, username: '', hash: '', cash: 0 };
  //   }

  //   async remove(id: string): Promise<void> {
  //     await this.userRepository.delete(id);
  //   }
}
