import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import { envConfig } from 'src/common/config/env.config';
import { User } from 'src/modules/users/user.entity';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: envConfig.JWT_SECRET,
      });

      const currentUser = await this.userService.findOne({
        userId: payload.userId,
      });

      if (!currentUser) {
        throw new HttpException(
          'The User Belonging to this token no longer exist',
          HttpStatus.UNAUTHORIZED,
        );
      }
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.currentUser = payload as Partial<typeof User>;
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
