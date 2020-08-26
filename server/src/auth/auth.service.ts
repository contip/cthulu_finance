import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../database/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { loginRegisterDto } from './interfaces/register-dto';
import { userDto } from '../database/interfaces/user-dto.interface';
import { tradeInputDto } from 'src/database/interfaces/trades-dto.interface';
import { HASH_SALT } from './constants';
import { LookupService } from 'src/lookup/lookup.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private lookupService: LookupService,
  ) {}

  /* password-based user validation function, used by routes guarded with
   * the 'local' strategy; returns user data if plaintext pw from req matches
   * stored hash */

  async validateUser(username: string, password: string): Promise<userDto> {
    const user = await this.userService.findByNameAuth(username);
    if (
      user &&
      user.username === username &&
      (await bcrypt.compare(password, user.hash))
    ) {
      /* remove hash value from the user object now that it is verified */
      delete user.hash;
      return user;
    }
    return null;
  }

  /* registers new user; recieves username and password from register
   * controller, hashes and forgets pw, stores in db, returns user data */
  async registerNewUser(regData: loginRegisterDto): Promise<userDto> {
    const hash = await bcrypt.hash(regData.password, HASH_SALT);
    regData.password = null;
    const toSave = { username: regData.username, hash: hash };
    /* createUser uses the typeorm save() function which should exclude
      returning the default unselected hash column, but it doesn't */
    try {
      let userData = await this.userService.createUser(toSave);
      delete userData.hash;
      return userData;
    } catch (error) {
      if (error?.code == 'SQLITE_CONSTRAINT') {
        throw new HttpException(
          'User with that username already exists!',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Error registering user!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* logs in user based on local strategy; issue JWT with username and id,
   * as well as relevant user data including cash and holdings */
  async login(user: any) {
    const payload = { username: user.username, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      userData: user,
    };
  }

  /* queries users table, returns true or false if given user exists in table */
  async userExists(username: string): Promise<Boolean> {
    return this.userService.userExists(username);
  }

  /* processes input request to ensure user in JWT is same user being modified
   * by trade; if valid, passes along the properly formatted tradeInputDto,
   * otherwise throw appropriate HttpException */
  async validateTrade(req: any): Promise<tradeInputDto> {
    if (
      !(req.body['user_id'] && req.body['stock_symbol'] && req.body['shares'])
    ) {
      throw new HttpException(
        'Invalid Request!',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (req.body['user_id'] != req.user.id) {
      throw new HttpException(
        'Unauthorized! Invalid JWT Credentials!',
        HttpStatus.UNAUTHORIZED,
      );
    }
    let tradeData: tradeInputDto = {
      user_id: req.body['user_id'],
      stock_symbol: req.body['stock_symbol'],
      shares: req.body['shares'],
    };
    return tradeData;
  }

  /* retrieves user data by the JWT associated with request, used by frontend
   *  to verify that stored JWT when deciding if user is logged in */
  async getUserByToken(decoded: any) {
    if (!(decoded.username && decoded.id)) {
      throw new HttpException('Invalid!', HttpStatus.BAD_REQUEST);
    }
    let userData = await this.userService.findByIdFull(decoded.id);
    if (!userData || userData.username.length < 1) {
      throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    }
    /* from userData, iterate thru their holdings if any... for each, call
     * the lookup api and get the price, add it to the holding object, then
     * calculate the total value (based on shares) and also add it */
    if (userData.holdings && userData.holdings.length > 0) {
      for (let i = 0; i < userData.holdings.length; i++) {
        let response = await (await this.lookupService.get_quote(userData.holdings[i].stock_symbol)).toPromise();
        userData.holdings[i].price = response.latestPrice;
        userData.holdings[i].value = response.latestPrice * userData.holdings[i].shares;
      }
    }
    const payload = { username: userData.username, id: userData.id };
    return {
      accessToken: this.jwtService.sign(payload),
      userData: userData,
    };
  }
}


