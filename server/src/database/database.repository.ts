import { Database } from './database.entity';
import { EntityRepository, Repository } from 'typeorm';
import { databaseDto } from './database.interface';

@EntityRepository(Database)
export class DatabaseRepo extends Repository<Database> {
    createUser = async (usrDto: databaseDto) => {
        return await this.save(usrDto);
    };
}