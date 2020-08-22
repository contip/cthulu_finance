import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    forwardRef(() => DatabaseModule),
    PassportModule, 
    JwtModule.register({
      secret: jwtConstants.SECRET,
      signOptions: {expiresIn: jwtConstants.EXPIRY},
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
