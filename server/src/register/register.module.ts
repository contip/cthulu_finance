import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { DatabaseModule } from '../database/user.module';
import { UserService } from 'src/database/user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RegisterController],
  providers: [UserService],
})
export class RegisterModule {}
