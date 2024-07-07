import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  @UseGuards(AuthGuard)
  @Serialize('User Data', UserDto)
  async findById(
    @Param('id') userId: { id: string },
    @CurrentUser() currentUser: Partial<User>,
  ) {
    const user = await this.usersService.findById(
      userId.toString(),
      currentUser,
    );
    if (user) {
      return {
        data: user,
      };
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
