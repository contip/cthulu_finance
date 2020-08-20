import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, createQueryBuilder } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { userDto } from './interfaces/user-dto.interface';
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
    return await this.userRepository.save(regDto);
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
  async findOne(username: string): Promise<userDto> {
    return (
      (await this.userRepository.findOne({ username: username })) || {
        id: -1,
        username: '',
        hash: '',
        cash: 0.0,
      }
    );
  }

     totalFindOneID = async (user_id: number) => {
       /* get the main user object, it if exists in db */
       /* error handlings.... */
       let userData = await this.findOneID(user_id);
       userData.holdings = await this.findOneIDHoldings(user_id);
       return userData;
  };

  /* returns object w/ 0 or more entries, 1 for each company user has 
   * in their portfolio
   * object has keys stock_name, stock_symbol, 'Count(stock_name)' */
     findOneIDHoldings = async (user_id: number) => {
    return await this.userRepository.query(`SELECT stock_name, 
    stock_symbol, COUNT(stock_name) FROM users INNER JOIN trades ON
    users.id = trades.userIdId WHERE id = ${user_id} GROUP BY stock_name;`);
   // console.log(holdings);
  };

/* returns object of type userDto, holding user login and financial info
 *  object has keys: id, username, hash, cash, trades[] */
  async findOneID(user_id: number): Promise<userDto> {
    return (await this.userRepository.findOne({ id: user_id })) || null;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
