/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity | null => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.currentUser ?? null; // 🛠️ Assure-toi que `currentUser` est bien défini
  },
);
