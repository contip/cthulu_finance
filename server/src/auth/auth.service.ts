import { Injectable } from '@nestjs/common';
import { UserService } from '../database/user.service';
import { userDto } from '../database/interfaces/user-dto.interface';


@Injectable()
export class AuthService {
    constructor (private userService: UserService) { }

    async validateUser(username: string, pass: string): Promise<userDto> {
        const user = await this.userService.findOne(username);
        if (user && user.hash === pass) {
            /* remember that i need to actually hash the passwords at some point */
            return user;
        }
        return null;
    }
}
