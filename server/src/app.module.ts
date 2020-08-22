import { Module, HttpModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LookupModule } from './lookup/lookup.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    HttpModule,
    DatabaseModule,
    AuthModule,
    LookupModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
