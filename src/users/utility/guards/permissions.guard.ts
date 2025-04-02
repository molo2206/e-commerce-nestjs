/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserPermissionService } from '../../../user-permissions/user-permissions.service';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userPermissionService: UserPermissionService, // Service pour vérifier les permissions
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const handler = context.getHandler();
        const requiredPermission: string | undefined = this.reflector.get<string>('permission', handler);

        // Si aucune permission n'est requise, on autorise l'accès
        if (!requiredPermission) {
            return true;
        }

        // Extraire `resource` et `action`
        const [resource, action] = requiredPermission.split(':'); // Vérifie le format de tes permissions !

        if (!resource || !action) {
            throw new Error(`Format de permission invalide : ${requiredPermission}`);
        }

        const request = context.switchToHttp().getRequest();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const user: UserEntity | undefined = request.user;

        if (!user) {
            throw new UnauthorizedException('Utilisateur non authentifié');
        }

        // Vérifie si l'utilisateur possède la permission requise
        const hasPermission = await this.userPermissionService.checkPermissions(user.id, resource, action);

        if (!hasPermission) {
            throw new ForbiddenException('Permission refusée');
        }

        return true;
    }


}
