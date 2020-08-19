import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trades } from './entities/trades.entity';
import { tradesDto, purchaseDto } from './interfaces/trades-dto.interface';
import { userDto } from './interfaces/user-dto.interface';
import { async } from 'rxjs';
import { UserService } from './user.service';
import { LookupService } from 'src/lookup/lookup.service';
/* need an import for DTO??  what DTO u using for trades ? */


@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trades)
    private tradesRepository: Repository<Trades>,
    private userService: UserService,
    private lookupService: LookupService,
  ) {}

    logPurchase = async (purchaseData: purchaseDto) => {
      /* validate the input data */
        /* input data will be a stock name, number of shares, user_id */
        /* check that given user_id is actually a user in the system */
        let user = (await this.userService.findOneID(purchaseData.user_id) ? 
        await this.userService.findOneID(purchaseData.user_id) : null)
        /* check that the stock name is valid and store the price info */


        


      /* check user money will cover purchase */
      /* add purchase to trades repository */
      /* subtract purchase amount from user cash */
      /* (possibly) add purchase details to user dto */
      //return await this.tradesRepository.save(purchaseData);


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