import { Injectable } from '@nestjs/common';
import { UserService } from '../database/user.service';
import { userDto } from '../database/interfaces/user-dto.interface';
import { JwtService } from '@nestjs/jwt';
import { async } from 'rxjs';


@Injectable()
export class AuthService {
    constructor (
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, pass: string): Promise<userDto> {
        const user = await this.userService.findOne(username);
        if (user && user.hash === pass) {
            /* remember that i need to actually hash the passwords at some point */
            return user;
        }
        return null;
    }

    async regLookup(username: string): Promise<userDto> {
        return await this.userService.findOne(username);
    }

    async registerUser(userDto: userDto): Promise<userDto> {
        return this.userService.createUser(userDto);


    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
