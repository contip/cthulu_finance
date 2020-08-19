import { Module, HttpService } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trades } from './entities/trades.entity';
import { TradesService } from './trades.service';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from './user.module';
import { TradesController } from './trades.controller';
import { LookupModule } from 'src/lookup/lookup.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trades]),
    AuthModule,
    DatabaseModule,
    LookupModule,
  ],
  exports: [TypeOrmModule, TradesService],
  providers: [TradesService],
  /* i might need a controller here to handle the post requests
        for buy / sell */
  controllers: [TradesController],
})
export class TradesModule {}
