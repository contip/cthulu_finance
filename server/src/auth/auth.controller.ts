import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

/* NEED A USERNAME AVAILABILITY CHECK HANDLER FOR USER REGISTRATION */
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Get('secretURL')
    secret(@Request() req) {
        return req.user;
    }

    // @UseGuards(AuthGuard('local'))
    @Post('/register')
    async register(@Request() req) {
        if (req.body.username != '' && req.body.hash === '')
        {
            console.log('we has receive a request with only the username')
            return this.authService.regLookup(req.body.username)
            
        }
        else {
            this.authService.registerUser(req.body);
            return this.authService.login(req.body)
        }
    }
}
