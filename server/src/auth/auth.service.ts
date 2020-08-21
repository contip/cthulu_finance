import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../database/user.service';
import { userDto } from '../database/interfaces/user-dto.interface';
import { JwtService } from '@nestjs/jwt';
import { namePassDto } from './interfaces/register-dto';
import { tradeInputDto } from 'src/database/interfaces/trades-dto.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /* I NEED A VALIDATE USER FUNCTION THAT ACCEPTS A JWT INPUT AND RETURNS
    AN ACTUAL USER (userDto) */
  async validateUser(username: string, password: string): Promise<userDto> {
    const user = await this.userService.totalFindOneName(username);
    if (user && user.username === username && user.hash === password) {
      /* remember that i need to actually hash the passwords at some point */
      return user;
    }
    return null;
  }

  /* this lookup function must only return a boolean depending on whether
   * or not user exists in db... NO other specific user info */
  async regLookup(username: string): Promise<userDto> {
    return await this.userService.totalFindOneName(username);
  }

  async registerUser(userDto: userDto): Promise<userDto> {
    let userData = await this.userService.createUser(userDto);
    return userData;

  }

  /* login needs to work like this:  first the overall login function 
        checks that the username exists in the db (there's a function for that)
        and get that user's ID
        IF THIS IS OKAY, THEN login needs to sign a JWT and issue it */
  /* this is where JWT signing takes place... needs fixing */
  // add expiration
  async login(user: any) {
    /* get the user's ID and generate them a token with username and id*/
    // let userData = await this.userService.totalFindOneName(loginData.username);
    // if (userData == null) {
    //   throw new HttpException('forbidden bung', HttpStatus.FORBIDDEN);
    // }

    const payload = { username: user.username, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      userData: user,
    };
  }

  async userExists(username: string): Promise<Boolean> {
    return this.userService.userExists(username);
  }

  async validateTrade(req: any): Promise<tradeInputDto> {
    if (
      !(req.body['user_id'] && req.body['stock_symbol'] && req.body['shares'])
    ) {
      throw new HttpException(
        'Invalid Request!',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    if (req.body['user_id'] != req.user.id) {
      console.log(
        'user id:',
        req.user.id,
        ' (jwt) is attempting to make',
        'changes to user id:',
        req.body['user_id'],
      );
      throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    }
    let tradeData: tradeInputDto = {
      user_id: req.body['user_id'],
      stock_symbol: req.body['stock_symbol'],
      shares: req.body['shares'],
    };
    return tradeData;
  }
}
