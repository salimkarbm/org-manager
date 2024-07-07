import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { OrganisationService } from '../organization/organization.service';
import { JwtService } from '@nestjs/jwt';
import { envConfig } from 'src/common/config/env.config';
import { User } from '../users/user.entity';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private organizationService: OrganisationService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccessToken(payload: User): Promise<string> {
    const token = this.jwtService.signAsync(
      JSON.parse(JSON.stringify(payload)),
      {
        expiresIn: envConfig.JWT_EXPIRATION,
      },
    );
    if (!token) {
      throw new HttpException(
        {
          status: 'Bad request',
          message: 'Authentication failed',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return token;
  }

  async register(createUserDto: CreateUserDto): Promise<Record<string, any>> {
    const userExists = await this.usersService.findOne({
      email: createUserDto.email,
    });
    if (userExists) {
      throw new HttpException(
        {
          status: 'Bad request',
          message: 'Registration unsuccessful',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;

    // Join the hashed result and salt together
    const hashedPassword = salt + '.' + hash.toString('hex');

    const result = { ...createUserDto, password: hashedPassword };

    // create user  and save to database
    const user = await this.usersService.create(result);

    // create organization
    await this.organizationService.create(
      {
        name: `${user.firstName}'s Organisation`,
      },
      user,
    );

    const accessToken = await this.createAccessToken(user);

    //return user
    return { user, accessToken };
  }

  async login(email: string, password: string): Promise<Record<string, any>> {
    const userExist = await this.usersService.findOne({ email });
    if (!userExist) {
      throw new HttpException(
        {
          status: 'Bad request',
          message: 'Authentication failed',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const [salt, storedHash] = userExist.password.split('.');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new HttpException(
        {
          status: 'Bad request',
          message: 'Authentication failed',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const accessToken = await this.createAccessToken(userExist);
    if (!accessToken) {
      throw new HttpException(
        {
          status: 'Bad request',
          message: 'Authentication failed',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { user: userExist, accessToken };
  }
}
