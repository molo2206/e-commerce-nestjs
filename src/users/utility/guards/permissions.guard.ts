/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { userHasPermission } from 'src/user-permissions/services/permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private dataSource: DataSource // <-- injecté ici
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { permission, action } =
            this.reflector.getAllAndOverride<{ permission: string; action: string }>(
                PERMISSION_KEY,
                [context.getHandler(), context.getClass()]
            ) || {};

        if (!permission || !action) return true;

        const request = context.switchToHttp().getRequest();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const user = request.currentUser;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        // console.log('request.user:', request.currentUser);
        if (!user) throw new ForbiddenException('Utilisateur non authentifié');

        const hasPermission = await userHasPermission(
            this.dataSource,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            user.id,
            permission,
            action as 'read' | 'create' | 'update' | 'delete'
        );


        if (!hasPermission) throw new ForbiddenException('Permission refusée');

        return true;
    }
}
