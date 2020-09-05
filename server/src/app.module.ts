import { Module, HttpModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LookupModule } from './lookup/lookup.module';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './database/entities/users.entity';
import { Trades } from './database/entities/trades.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [UserEntity, Trades],
      synchronize: true,  //dev only
    }),
    HttpModule,
    DatabaseModule,
    AuthModule,
    LookupModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
