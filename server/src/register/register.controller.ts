import { Controller, Post , Body } from '@nestjs/common';
import { RegisterModule } from './register.module';
import { UserService } from 'src/database/user.service';
import { registerDto } from '../database/interfaces/register-dto.interface';
import { userDto } from 'src/database/interfaces/user-dto.interface';

@Controller('register')
export class RegisterController {
    constructor(private readonly UserService: UserService,
        ) {}

    @Post()
    createUser(@Body() body: Body) {
        console.log(body);
        /* i want to send the info in body to the UserService to add to db */

        const myDto: userDto = {
            username: body['username'],
            hash: body['hash'],
        }
        console.log(myDto);
        return this.UserService.createUser(myDto);

    }
}
