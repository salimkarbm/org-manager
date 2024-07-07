import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Serialize('Registration successful', AuthDto)
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Record<string, any>,
  ) {
    if ('errors' in createUserDto) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(createUserDto);
    }
    const { user, accessToken } =
      await this.authService.register(createUserDto);
    return {
      data: {
        accessToken,
        user,
      },
    };
  }

  @Post('login')
  @Serialize('Login successful', AuthDto)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() createUserDto: Partial<CreateUserDto>,
    @Res({ passthrough: true }) res: Record<string, any>,
  ) {
    if ('errors' in createUserDto) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(createUserDto);
    }
    const { user, accessToken } = await this.authService.login(
      createUserDto.email,
      createUserDto.password,
    );
    return {
      data: {
        accessToken,
        user,
      },
    };
  }
}
