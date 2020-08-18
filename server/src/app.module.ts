import { Module, HttpModule } from '@nestjs/common';
import { AppService } from './app.service';
import { LookupService } from './lookup/lookup.service';
import { LookupController } from './lookup/lookup.controller';
import { DatabaseModule } from './database/user.module';
import { TradesModule } from './database/trades.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TradesController } from './database/trades.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    HttpModule,
    DatabaseModule,
    AuthModule,
    TradesModule,
  ],
  controllers: [LookupController, TradesController],
  providers: [AppService, LookupService],
})
export class AppModule {}
