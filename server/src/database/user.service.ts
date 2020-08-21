import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, createQueryBuilder } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import {
  userDto,
  holdingDto,
  portfolioDto,
} from './interfaces/user-dto.interface';
import { Trades } from './entities/trades.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /* must include hashing of plaintext passwords... */
  /* fix variable name and add type */
  createUser = async regDto => {
    let newUser = await this.userRepository.save(regDto);
    if (!newUser || newUser == null || newUser.length == 0 || Object.keys(newUser).length == 0) {
      throw new HttpException("Error creating User!", HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return newUser;
  };

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  /* when user types username into registration field, it will automatically
   * call this function to see if a user with that name already exists in DB
   * if so, returns that user
   * if not, returns simple key value pair VALID: VALID
   */
  /* instead of returning a user with negative id to deal with client side..
    you need to return an error here, and in many other places */

  /* 
  async findOne(username: string): Promise<userDto> {
    return (
      (await this.userRepository.findOne({ username: username })) || {
        id: -1,
        username: '',
        hash: '',
        cash: 0.0,
      }
    );
  } */
  totalFindOneName = async (username: string): Promise<userDto> => {
    let userData: userDto = await this.userRepository.findOne({
      username: username,
    });
    userData['holdings'] = await this.findOneIDHoldings(userData.id);
    return userData;
  };

  totalFindOneID = async (user_id: number): Promise<userDto> => {
    /* get the main user object, it if exists in db */
    /* error handlings.... */
    let userData = await this.findOneID(user_id);
    userData.holdings = await this.findOneIDHoldings(user_id);
    return userData;
  };

  findOneIDTransactions = async (
    user_id: number,
  ): Promise<Array<portfolioDto>> => {
    let transactions: Array<portfolioDto> = await this.userRepository
      .query(`SELECT date, 
    stock_symbol, stock_name, stock_price, shares, transaction_price FROM users 
    INNER JOIN trades ON users.id = trades.userIdId WHERE id=${user_id};`);
    //console.log(transactions);
    return transactions;
  };

  /* returns object w/ 0 or more entries, 1 for each company user has
   * in their portfolio
   * object has keys stock_name, stock_symbol, 'Count(stock_name)' */
  findOneIDHoldings = async (user_id: number): Promise<Array<holdingDto>> => {
    let holdings: Array<holdingDto> = await this.userRepository
      .query(`SELECT stock_name, 
    stock_symbol, SUM(shares) FROM users INNER JOIN trades ON
    users.id = trades.userIdId WHERE id = ${user_id} GROUP BY stock_name;`);
    // console.log(holdings);
    /* rename autogenerated key name from 'SUM(shares)' to 'shares' */
    for (let i = 0; i < holdings.length; i++) {
      holdings[i]['shares'] = holdings[i]['SUM(shares)'];
      delete holdings[i]['SUM(shares)'];
    }
    return holdings;
  };

  /* returns object of type userDto, holding user login and financial info
   *  object has keys: id, username, hash, cash, trades[] */
  async findOneID(user_id: number): Promise<userDto> {
    return (await this.userRepository.findOne({ id: user_id })) || null;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByPayload(payload: any): Promise<userDto> {
    const { username } = payload;
    return await this.userRepository.findOne({ username });
  }

  userExists = async (username: string): Promise<boolean> => {
    let userData = await this.userRepository.findOne({ username: username });
    if (userData == null) {
      return false;
    }
    return true;
    //return ((await this.totalFindOneName(username)).username === username);
  };
}
