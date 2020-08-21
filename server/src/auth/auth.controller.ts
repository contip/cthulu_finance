import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { userDto } from 'src/database/interfaces/user-dto.interface';

/* NEED A USERNAME AVAILABILITY CHECK HANDLER FOR USER REGISTRATION */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
      console.log("req.user is: ", req.user);
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('secretURL')
  secret(@Request() req) {
    return req.user;
  }

  /* this should accept a post request with body containing only two entries:
    username: string, password: string */
  // @UseGuards(AuthGuard('local'))
  @Post('/register')
  async register(@Body() body: Body): Promise<any> {
    // if (req.body.username != '' && req.body.hash === '') {
    //   console.log('we has receive a request with only the username');
    //   return this.authService.regLookup(req.body.username);
    // } else {
    let userData = await this.authService.registerNewUser(body);
    return await this.authService.login(userData);
    }
  

  /* /available route for checking username availability MUST be given
        POST request with single entry in body: { username: to_check } */
  //@UseGuards(AuthGuard('jwt'))
  /* handle illegal entries (extra fields in req body, invalid symbols, etc) */
  @Post('/available')
  async available(@Body() body: Body): Promise<Boolean> {
    return !(await this.authService.userExists(body['username']));
  }
}
