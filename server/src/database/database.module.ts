import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { UserService } from './user.service';
import { Trades } from './entities/trades.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LookupModule } from 'src/lookup/lookup.module';
import { TradesService } from './trades.service';
import { DatabaseController } from './database.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, Trades]),
    forwardRef(() => AuthModule),
    LookupModule,
  ],
  exports: [TypeOrmModule, UserService, TradesService],
  providers: [UserService, TradesService],
  controllers: [DatabaseController],
})
export class DatabaseModule {}
