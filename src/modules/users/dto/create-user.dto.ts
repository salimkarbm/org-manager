import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
} from 'class-validator';
import { REGEX, ERROR_MESSAGE } from '../../../common/constants';

export class CreateUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  @Matches(REGEX.PHONE, { message: ERROR_MESSAGE.PHONE })
  phone: string;
}
