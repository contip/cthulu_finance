import { Controller, Post , Body } from '@nestjs/common';
import { RegisterModule } from './register.module';
import { UserService } from 'src/database/user.service';
import { registerDto } from '../database/interfaces/register-dto.interface';
import { userDto } from 'src/database/interfaces/user-dto.interface';
import { response } from 'express';
import { map } from 'rxjs/operators';

@Controller('register')
export class RegisterController {
    constructor(private readonly UserService: UserService,
        ) {}

    @Post()
    createUser(@Body() body: Body) {
        console.log(body);
        /* i want to send the info in body to the UserService to add to db */
        if (body['username'] !== '' && (body['hash'] === '' || body['confirm'] === '')) {
            /* this must be a username lookup request */
            console.log('we have got a post request with only the username');
            return this.UserService.findOne(body['username']);
            // let a = this.UserService.findOne(body['username']);
            // a.then(fulfilled => {return {a}}, reject => console.log('butt'))
                // {
                //     if (connection){
                //         /* in this case, the name being checked already exists
                //         * as a user in DB, therefore send back in the response
                //         * something indicating that the name is invalid!!! */
                //         console.log(connection);
                //         connection
                //         return this.UserService.findOne(body['username'])
                //     }
                //     else {
                //         console.log('butt sniffer');
                //     }
                // });
        }
        else {
        const myDto: userDto = {
            username: body['username'],
            hash: body['hash'],
        }
        console.log(myDto);
        return this.UserService.createUser(myDto);

    }
    }
}
