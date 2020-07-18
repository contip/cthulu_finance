import { Module, HttpModule } from '@nestjs/common';
import { AppService } from './app.service';
import { LookupService } from './lookup/lookup.service'
import { LookupController } from './lookup/lookup.controller';
import { DatabaseModule } from './database/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterModule } from './register/register.module';
import { LoginController } from './login/login.controller';
import { LoginModule } from './login/login.module';

@Module({
  imports: [TypeOrmModule.forRoot(), HttpModule, DatabaseModule, RegisterModule, LoginModule],
  controllers: [LookupController, LoginController],
  providers: [AppService, LookupService]
})
export class AppModule {}
