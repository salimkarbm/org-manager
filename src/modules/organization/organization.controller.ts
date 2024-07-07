import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrganisationService } from './organization.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { OrganisationDto, UserOrganisationsDto } from './dto/organization.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organisations')
export class OrganisationController {
  constructor(private readonly usersService: OrganisationService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize('Organisation created successfully', OrganisationDto)
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser() user: User,
  ) {
    const organisation = await this.usersService.create(
      createOrganizationDto,
      user,
    );
    return organisation;
  }

  @Post('/:orgId/users')
  @HttpCode(HttpStatus.OK)
  async addUserToOrganisation(
    @Body() body: { userId: string },
    @Param('orgId') orgId: { orgId: string },
  ) {
    await this.usersService.addUserToOrganisation(orgId.toString(), body);
    return {
      status: 'success',
      message: 'User added to organisation successfully',
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @Serialize('User Organizations List', UserOrganisationsDto)
  async getAllUserOrganisations(@CurrentUser() user: Partial<User>) {
    const organisations = await this.usersService.getAllUserOrganisations(user);
    return {
      data: {
        organisations,
      },
    };
  }

  @Get('/:orgId')
  @UseGuards(AuthGuard)
  @Serialize('Organizations Details ', OrganisationDto)
  async getOrganisation(
    @Param('orgId') orgId: { orgId: string },
    @CurrentUser() user: Partial<User>,
  ) {
    const organisation = await this.usersService.getOrganisation(
      orgId.toString(),
      user,
    );
    return organisation;
  }
}
