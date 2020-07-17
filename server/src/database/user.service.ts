import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { registerDto } from './interfaces/register-dto.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  createUser = async (regDto) => {
    return await this.userRepository.save(regDto);
  };

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}