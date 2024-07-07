import { Module } from '@nestjs/common';
import { OrganisationService } from './organization.service';
import { OrganisationController } from './organization.controller';
import { Organisation } from './organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation, User])],
  providers: [OrganisationService, UsersService],
  controllers: [OrganisationController],
})
export class OrganizationModule {}
