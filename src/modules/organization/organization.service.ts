import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Organisation } from './organization.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisation: Repository<Organisation>,
    private readonly usersService: UsersService,
  ) {}

  create(
    createOrganizationDto: CreateOrganizationDto,
    user: User,
  ): Promise<Organisation> {
    delete user['iat'];
    delete user['exp'];
    const organization = this.organisation.create(createOrganizationDto);
    organization.users = [user];
    const organisation = this.organisation.save(organization);

    if (!organisation)
      throw new HttpException(
        {
          status: 'Bad Request',
          message: 'Client error',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );

    return organisation;
  }

  findOne(orgId: string): Promise<Organisation> {
    if (!orgId) return null;
    return this.organisation.findOne({ where: { orgId } });
  }

  find(): Promise<Organisation[]> {
    return this.organisation.find();
  }

  async getAllUserOrganisations(user: Partial<User>): Promise<Organisation[]> {
    delete user['iat'];
    delete user['exp'];
    const organisations = await this.organisation.find({
      where: { users: user },
    });
    return organisations;
  }

  async getOrganisation(
    orgId: string,
    user: Partial<User>,
  ): Promise<Organisation> {
    delete user['iat'];
    delete user['exp'];
    const organisation = await this.organisation
      .createQueryBuilder('organisation')
      .leftJoinAndSelect('organisation.users', 'user')
      .where('user.userId = :userId', { userId: user.userId })
      .andWhere('organisation.orgId = :orgId', { orgId })
      .select([
        'organisation.orgId',
        'organisation.name',
        'organisation.description',
      ])
      .getOne();

    if (!organisation) {
      throw new HttpException('Organisation not found', HttpStatus.NOT_FOUND);
    }

    return organisation;
  }

  async addUserToOrganisation(
    orgId: string,
    body: { userId: string },
  ): Promise<Organisation> {
    const { userId } = body;
    const organisation = await this.organisation.findOne({
      where: { orgId: orgId },
      relations: ['users'],
    });

    if (!organisation) {
      throw new HttpException('Organisation not found', HttpStatus.NOT_FOUND);
    }

    if (organisation.users.find((user) => user.userId === userId)) {
      throw new HttpException(
        'User already exists in organisation',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersService.findOne({ userId: userId });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    organisation.users.push(user);
    await this.organisation.save(organisation);

    return organisation;
  }
}
