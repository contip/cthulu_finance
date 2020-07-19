import { Controller, Post , Body } from '@nestjs/common';
import { UserService } from 'src/database/user.service';
import { userDto } from 'src/database/interfaces/user-dto.interface';
import { response } from 'express';
import { map } from 'rxjs/operators';

@Controller('login')
export class LoginController {
    constructor(private readonly UserService: UserService,
        ) {}

//     @Post()
//     validateUser(@Body() body: Body) {
//         console.log(body);
//             if ((this.UserService.findOne(body['username'])) === (this.UserService.findOne(body['hash'])))
//             {
//                 return this.UserService.findOne(body['username'])

//             };
//         }
//         const myDto: userDto = {
//             username: body['username'],
//             hash: body['hash'],
//         }
//         console.log(myDto);
//         return this.UserService.createUser(myDto);

//     }
//     }
}
