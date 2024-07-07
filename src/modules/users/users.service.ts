import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.user.create(createUserDto);
    return this.user.save(user);
  }

  findOne(obj: Record<string, any>): Promise<User> {
    return this.user.findOne({ where: obj });
  }

  find(obj: Record<string, any>): Promise<User[]> {
    return this.user.find(obj);
  }

  async findById(userId: string, currentUser: Partial<User>): Promise<User> {
    if (currentUser.userId !== userId) {
      throw new HttpException('Forbidden access', HttpStatus.FORBIDDEN);
    }
    const user = this.findOne({ userId: userId });
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
