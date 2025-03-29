/* eslint-disable prettier/prettier */

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
    currentUser?: UserEntity;
}

@Injectable()
export class AuthentificationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        if (!request.currentUser) {
            throw new UnauthorizedException('Accès non autorisé. Veuillez vous connecter.');
        }
        return true;
    }
}

