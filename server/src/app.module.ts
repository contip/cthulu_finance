import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LookupService } from './lookup.service'
import { LookupController } from './lookup.controller';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, LookupController],
  providers: [AppService, LookupService, DatabaseService]
})
export class AppModule {}
