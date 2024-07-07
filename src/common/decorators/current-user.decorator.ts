import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/users/user.entity';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): Partial<typeof User> => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser;
  },
);
