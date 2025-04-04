/* eslint-disable prettier/prettier */
// services/permissions.ts
import { DataSource } from 'typeorm';

export async function userHasPermission(
    dataSource: DataSource,
    userId: number,
    permissionName: string,
    action: 'read' | 'create' | 'update' | 'delete'
): Promise<boolean> {
    const query = dataSource
        .getRepository('user_permissions')
        .createQueryBuilder('rp')
        .innerJoin('rp.affectation', 'a')
        .innerJoin('rp.permission', 'p')
        .where('a.userid = :userId', { userId })
        .andWhere('p.name = :permissionName', { permissionName });

    switch (action) {
        case 'read':
            query.andWhere('rp.read = true');
            break;
        case 'create':
            query.andWhere('rp.create = true');
            break;
        case 'update':
            query.andWhere('rp.update = true');
            break;
        case 'delete':
            query.andWhere('rp.delete = true');
            break;
        default:
            return false;
    }

    const result = await query.getOne();
    return !!result;
}
