import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/user.entity';

export class AuthDto {
  constructor(partial: Partial<AuthDto>) {
    Object.assign(this, partial);
  }
  @Expose()
  accessToken: string;

  @Expose()
  @Transform(({ obj }) => {
    const user = obj.user;
    const filteredUser = {
      userId: user.userId,
      firstName: user.firstName,
      email: user.email,
      phone: user.phone,
      lastName: user.lastName,
    };
    return filteredUser;
  })
  user: User;
}
