import { Expose, Transform } from 'class-transformer';
import { User } from '../user.entity';

export class UserDto {
  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Transform(({ obj }) => {
    const filteredUser = {
      userId: obj.userId,
      firstName: obj.firstName,
      email: obj.email,
      phone: obj.phone,
      lastName: obj.lastName,
    };
    return filteredUser;
  })
  user: User;
}
