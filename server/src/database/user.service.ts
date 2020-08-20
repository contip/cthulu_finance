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
  createUser = async (regDto) => {
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
  async findOne (username: string): Promise<userDto> {
    return await this.userRepository.findOne({ username: username }) || { id: -1, username: '', hash: '', cash: 0.00 };
  }

  async findOneIDHoldings (user_id: number): Promise<userDto> {
    const holdings: any = await this.userRepository
    .createQueryBuilder("users")
    .innerJoinAndSelect("users.trades", "trd", )
    // .innerJoin("users.trades", "trd")
    // .select(['users.id', 'users.username', 'trd.stock_name', 'COUNT(trd.stock_name)'])
    // .where('users.id = :id', {id: user_id})
    // .orderBy('trd.stock_name')
    .printSql()
    .getOne();
    console.log(holdings);
    return holdings;
  } 
    
  async findOneID (user_id: number): Promise<userDto> {
    return await this.userRepository.findOne({ id: user_id }) || null;
  }
  

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}