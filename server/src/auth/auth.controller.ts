import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { loginRegisterDto } from './interfaces/register-dto';
import { userNameConstraints } from './constants';
import { userDto } from 'src/database/interfaces/user-dto.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /* login controller assumes post req with body containing entries for
   * 'username' and 'password' */
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req: any): Promise<any> {
    /* passport automatically adds 'username' and 'password' fields from body
     * of incoming request to req.user; this is sent to login service
     * if either field missing or invalid, returns unauthorized */
    return this.authService.login(req.user);
  }

  /* TODO: this route is potentially unnecessary.. frontend user can just
   * attempt to login again behind the scenes to obtain a new jwt and current
   * user data */
  /* users controller allows retrieval of user data for get requests bearing
   * valid jwt credentials */
  @UseGuards(AuthGuard('jwt'))
  @Get('/users')
  async users(@Request() req: any): Promise<any|HttpException> {
    return await this.authService.getUserByToken(req.user);
  }
  
  /* register controller is unguarded and assumes post req with body 
   * containing entries for 'username' and 'password' */
  @Post('/register')
  async register(@Body() body: Body): Promise<any> {
    if (
      !(body['username'] && body['password'] && Object.keys(body).length == 2)
    ) {
      throw new HttpException('Invalid request!', HttpStatus.BAD_REQUEST);
    }
    let regData: loginRegisterDto = {
      username: body['username'],
      password: body['password'],
    };
    let userData = await this.authService.registerNewUser(regData);
    return await this.authService.login(userData);
  }

  /* unguarded available controller accepts req with single field ('username')
   * in body, returns true if username is available in db, false otherwise */
  @Post('/available')
  async available(@Body() body: Body): Promise<Boolean> {
    /* impose restrictions on username length and legal chars */
    if (
      !body['username'] ||
      body['username'].length > userNameConstraints.MAX_LENGTH ||
      !body['username'].match(userNameConstraints.LEGAL_CHARS)
    ) {
      return false;
    }
    return !(await this.authService.userExists(body['username']));
  }
}
