import { Module, HttpModule } from '@nestjs/common';
import { AppService } from './app.service';
import { LookupService } from './lookup/lookup.service'
import { LookupController } from './lookup/lookup.controller';
import { DatabaseModule } from './database/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(), HttpModule, DatabaseModule, AuthModule],
  controllers: [LookupController],
  providers: [AppService, LookupService]
})
export class AppModule {}
