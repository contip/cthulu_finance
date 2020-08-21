import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  /* this function right here needs to check if token is valid for whatever
    the user is trying to do */
  async validate(payload: any) {
    console.log('jwt authguard validate function is being called');
    /* payload will be a POST request protected by JWT authguard */
    /* make sure the decoded token userId matches the userId of the request */
    // console.log('payload given to jwt authguard function is: ', payload);
    // console.log('username given to jwt auth is:', username);
    // console.log('id given to jwt auth is:', id);
    // return { bunghildaa: 'bunghildax'};
    //throw new HttpException('forbidden bung', HttpStatus.FORBIDDEN);
    return { username: payload.username, id: payload.id };
  }
}
