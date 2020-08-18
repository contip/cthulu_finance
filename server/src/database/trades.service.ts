import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trades } from './entities/trades.entity';
import { tradesDto } from './interfaces/trades-dto.interface';
import { async } from 'rxjs';
/* need an import for DTO??  what DTO u using for trades ? */


@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trades)
    private tradesRepository: Repository<Trades>,
  ) {}

    logPurchase = async (purchaseData) => {
      return await this.tradesRepository.save(purchaseData);


    }

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