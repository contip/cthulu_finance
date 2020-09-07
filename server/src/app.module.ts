import { Module, HttpModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LookupModule } from './lookup/lookup.module';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './database/entities/users.entity';
import { Trades } from './database/entities/trades.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as PostgressConnectionStringParser from 'pg-connection-string';

/* if NODE_ENV is development, will use postgres connection info from
 * process.env.POSTGRES*, otherwise decoded from process.env.DATABASE_URL */
const databaseUrl: string = process.env.DATABASE_URL;
const connectionOptions =
  process.env.NODE_ENV === 'development'
    ? {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
      }
    : PostgressConnectionStringParser.parse(databaseUrl);

@Module({
  imports: [
    /* enables serving the compiled frontend from the "build" subdirectory */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'build'),
      /* exclude backend api routes from serve static module */
      exclude: ['/auth*', '/trades*', '/lookup'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: connectionOptions.host,
      port: parseInt(connectionOptions.port),
      username: connectionOptions.user,
      password: connectionOptions.password,
      database: connectionOptions.database,
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
