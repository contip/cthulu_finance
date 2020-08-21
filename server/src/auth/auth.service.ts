import { Injectable } from '@nestjs/common';
import { UserService } from '../database/user.service';
import { userDto } from '../database/interfaces/user-dto.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, pass: string): Promise<userDto> {
        const user = await this.userService.totalFindOneName(username);
        if (user && user.hash === pass) {
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
        return this.userService.createUser(userDto);


    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            accessToken: this.jwtService.sign(payload),
            userName: payload.username
        };
    }

    async userExists(username: string): Promise<Boolean> {
        return this.userService.userExists(username);
    }
}
