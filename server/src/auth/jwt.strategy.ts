import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /* function executes every time route guarded by 'jwt' strategy is
   * triggered */
  async validate(payload: any) {
    /* passes decoded jwt data to be validated by auth service */
    return { username: payload.username, id: payload.id };
  }
}
