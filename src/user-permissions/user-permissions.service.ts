/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermissionEntity } from './entities/user-permission.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionRepo: Repository<UserPermissionEntity>,
  ) { }

  async assignPermission(
    affectationId: string,
    permissionId: string,
    actions: Partial<UserPermissionEntity>
  ): Promise<any> {
    let userPerm = await this.userPermissionRepo.findOne({
      where: { affectation: { id: affectationId }, permission: { id: permissionId } }
    });

    if (!userPerm) {
      // Si l'autorisation n'existe pas, on la crée
      userPerm = this.userPermissionRepo.create({
        affectation: { id: affectationId },
        permission: { id: permissionId },
        create: actions.create ?? false,
        update: actions.update ?? false,
        delete: actions.delete ?? false,
        read: actions.read ?? false,
        status: actions.status ?? true,
      });
    } else {
      // Si l'autorisation existe, on met à jour ses actions
      userPerm.create = actions.create ?? userPerm.create;
      userPerm.update = actions.update ?? userPerm.update;
      userPerm.delete = actions.delete ?? userPerm.delete;
      userPerm.read = actions.read ?? userPerm.read;
      userPerm.status = actions.status ?? userPerm.status;
    }

    // Sauvegarde et récupération des données liées à l'affectation
    const savedPermission = await this.userPermissionRepo.save(userPerm);

    const fullUserPermission = await this.userPermissionRepo.findOne({
      where: { id: savedPermission.id },
      relations: [
        'affectation.organisation', // Récupérer l'organisation liée à l'affectation
        'affectation.user',         // Récupérer l'utilisateur lié à l'affectation
        'affectation.permissions',  // Ajouter les permissions à l'affectation
        'affectation.permissions.permission' // Extraire les détails des permissions
      ],
    });

    if (!fullUserPermission) {
      throw new Error('UserPermissionEntity not found after save');
    }

    // Structurer les données à retourner dans un format similaire à la réponse de connexion
    const affectationData = fullUserPermission.affectation;

    return {
      user: {
        ...affectationData.user,
        affectations: [
          {
            id: affectationData.id,
            status: affectationData.status,
            deleted: affectationData.deleted,
            createdAt: affectationData.createdAt,
            updatedAt: affectationData.updatedAt,
            organisation: affectationData.organisation,
            permissions: affectationData.permissions.map(permission => permission.permission), // Permissions de l'affectation
          }
        ]
      },
    };
  }

  async checkPermissions(userId: number, resource: string, action: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['affectations'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.affectations.some((affectation) => {
      return (
        affectation.id === resource &&
        affectation[action as keyof UserPermissionEntity] === true
      );
    });
  }
}
