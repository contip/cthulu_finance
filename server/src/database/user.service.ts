import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/users.entity';
import { loginRegisterDto } from 'src/auth/interfaces/register-dto';
import {
  userDto,
  holdingDto,
  portfolioDto,
} from './interfaces/user-dto.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /* creates or updates user with given data, depending on whether
   * entry for that user already exists in users table */
  async createUser(regData: loginRegisterDto | userDto) {
    let newUser = await this.userRepository.save(regData);
    if (!newUser || newUser == null || Object.keys(newUser).length == 0) {
      throw new HttpException('Invalid Request!', HttpStatus.BAD_REQUEST);
    }
    return newUser;
  }

  /* gets all data from users table for given username, plus holdings */
  async findByNameFull(username: string): Promise<userDto> {
    let userData: userDto = await this.userRepository.findOne({
      username: username,
    });
    userData['holdings'] = await this.getHoldingsById(userData.id);
    return userData;
  }

  /* gets all user data by username, and forces selection of the user hash
   * column; only called by Auth Module for local passport strategy */
  async findByNameAuth(username: string): Promise<userDto> {
    let userData: userDto = await this.userRepository.findOne(
      {
        username: username,
      },
      { select: [`username`, `hash`, `id`, `cash`] },
    );
    if (!userData || userData == null) {
      return null; // okay to return null since auth will raise exception
    }
    userData['holdings'] = await this.getHoldingsById(userData.id);
    return userData;
  }

  /* returns all user data plus array of holdings, by input user id */
  async findByIdFull(user_id: number): Promise<userDto> {
    /* get the main user object, it if exists in db */
    let userData = await this.findById(user_id);
    userData.holdings = await this.getHoldingsById(user_id);
    return userData;
  }

  /* from given user id, gets array of all user transactions; returns empty
   * array if no user transactions exist */
  async getTransactionsById(user_id: number): Promise<Array<portfolioDto>> {
    /* postgres query:
     * SELECT date, stock_symbol, stock_name, stock_price, shares,
     * transaction_price FROM users INNER JOIN trades ON users.id =
     * trades."userIdId" WHERE id = 1; */
    let transactions: UserEntity = await this.userRepository
      .createQueryBuilder('users')
      .innerJoin('users.trades', 'trades')
      .addSelect([
        'trades.date',
        'trades.stock_symbol',
        'trades.stock_name',
        'trades.stock_price',
        'trades.shares',
        'trades.transaction_price',
      ])
      .where('users.id = :id', { id: user_id })
      .getOne();
    return transactions.trades;
  }

  /* returns array of user stock holdings, one object for each holding */
  async getHoldingsById(user_id: number): Promise<Array<holdingDto>> {
    /* postgres query:
     * SELECT SUM(shares), stock_name, stock_symbol FROM users INNER JOIN
     * trades ON id=trades."userIdId" WHERE id=1 GROUP BY stock_name,
     * stock_symbol; */
    let holdings = await this.userRepository
      .createQueryBuilder('users')
      .innerJoin('users.trades', 'trades')
      .select('SUM(shares)', 'shares')
      .addSelect(['stock_name', 'stock_symbol'])
      .where('users.id = :id', { id: user_id })
      .groupBy('stock_name, stock_symbol')
      .getRawMany();
    /* remove any holdings for which user has 0 shares */
    for (let i = 0; i < holdings.length; i++) {
      if (holdings[i].shares === '0') {
        holdings.splice(i, 1);
      }
    }
    return holdings;
  }

  /* from given user id, returns associated data from users table; does not
   * append holdings data */
  async findById(user_id: number): Promise<userDto> {
    return (await this.userRepository.findOne({ id: user_id })) || null;
  }

  /* from given username, returns true if user exists in users table, false
   * otherwise */
  async userExists(username: string): Promise<boolean> {
    let userData = await this.userRepository.findOne({ username: username });
    if (userData == null) {
      return false;
    }
    return true;
  }
}
