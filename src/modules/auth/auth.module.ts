import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from 'src/common/config/env.config';
import { OrganisationService } from '../organization/organization.service';
import { Organisation } from '../organization/organization.entity';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envConfig.JWT_SECRET,
      signOptions: { expiresIn: envConfig.JWT_EXPIRATION },
    }),
    TypeOrmModule.forFeature([User, Organisation]),
  ],
  providers: [AuthService, UsersService, OrganisationService],
  controllers: [AuthController],
})
export class AuthModule {}
