import { Module, HttpModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LookupModule } from './lookup/lookup.module';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './database/entities/users.entity';
import { Trades } from './database/entities/trades.entity';
import * as PostgressConnectionStringParser from "pg-connection-string";

const databaseUrl: string = process.env.DATABASE_URL;
const connectionOptions = PostgressConnectionStringParser.parse(databaseUrl);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: connectionOptions.host || process.env.POSTGRES_HOST,
      port: parseInt(connectionOptions.port) || parseInt(process.env.POSTGRES_PORT),
      username: connectionOptions.user || process.env.POSTGRES_USER,
      password: connectionOptions.password || process.env.POSTGRES_PASSWORD,
      database: connectionOptions.database || process.env.POSTGRES_DB,
      entities: [UserEntity, Trades],
      synchronize: true,
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
