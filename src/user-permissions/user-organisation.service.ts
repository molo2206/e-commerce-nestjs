/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrganisationEntity } from './entities/user-organization.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrganizationEntity } from './entities/organization.entity';

@Injectable()
export class UserOrganizationService {
    constructor(
        @InjectRepository(UserOrganisationEntity)
        private readonly userOrganisationRepo: Repository<UserOrganisationEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>, // Utilisation du repository personnalisé

        @InjectRepository(OrganizationEntity)
        private readonly organizationRepo: Repository<OrganizationEntity>,
    ) { }
    async assignUserToOrg(userId: number, orgId: string): Promise<UserOrganisationEntity> {
        // Vérification de l'existence de l'utilisateur
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        // Vérification de l'existence de l'organisation
        const org = await this.organizationRepo.findOne({ where: { id: orgId } });
        if (!org) {
            throw new NotFoundException('Organisation non trouvée');
        }

        // Vérification si l'utilisateur est déjà affecté à l'organisation
        const existingAffectation = await this.userOrganisationRepo.findOne({
            where: { user, organisation: org },
        });

        if (existingAffectation) {
            throw new ConflictException('Cet utilisateur est déjà affecté à cette organisation.');
        }

        // Création et sauvegarde de la nouvelle affectation
        const userOrg = this.userOrganisationRepo.create({
            user,          // ✅ Utilisation de l'objet UserEntity
            organisation: org, // ✅ Utilisation de l'objet OrganizationEntity
        });

        return await this.userOrganisationRepo.save(userOrg);
    }

}