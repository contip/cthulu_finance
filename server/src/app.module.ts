import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LookupService } from './lookup.service'
import { LookupController } from './lookup.controller';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(), HttpModule, DatabaseModule],
  controllers: [AppController, LookupController],
  providers: [AppService, LookupService]
})
export class AppModule {}
