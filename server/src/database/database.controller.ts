import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './database.service';
import { userDto } from './database.interface';

@Controller('database')
export class DatabaseController {
    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(@Body() body: Body) {
        console.log(body)
        const myDto = {
            id: body['id'],
            username: body['username'],
            hash: body['hash'],
            cash: body['cash']
        }
        console.log(myDto);
        return this.userService.createUser(myDto);
    }
}
