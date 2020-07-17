import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    exports: [TypeOrmModule, UserService],
    providers: [UserService],
    controllers: []
})
export class DatabaseModule {}
