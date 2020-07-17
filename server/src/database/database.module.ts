import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './database.entity';
import { UserService } from './database.service';
import { DatabaseController } from './database.controller';


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    exports: [TypeOrmModule, UserService],
    providers: [UserService],
    controllers: [DatabaseController]
})
export class DatabaseModule {}
