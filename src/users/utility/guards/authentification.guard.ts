/* eslint-disable prettier/prettier */

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthentificationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const request = context.switchToHttp().getRequest(); // Récupère la requête HTTP

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!request?.currentUser) {
            throw new UnauthorizedException('Accès non autorisé. Veuillez vous connecter.');
        }

        return true;
    }
}
