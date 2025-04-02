/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(OrganizationEntity)
        private readonly orgRepo: Repository<OrganizationEntity>
    ) { }

    // Crée une nouvelle organisation
    async create(data: Partial<OrganizationEntity>): Promise<OrganizationEntity> {
        // Validation de base sur les champs requis
        if (!data.name || !data.email) {
            throw new BadRequestException('Organization name and email are required');
        }

        // Vérification d'existence d'une organisation avec le même email
        const existingOrg = await this.orgRepo.findOne({ where: { email: data.email } });
        if (existingOrg) {
            throw new BadRequestException('Organization with this email already exists');
        }

        // Création et sauvegarde de l'organisation
        const organisation = this.orgRepo.create(data);
        return await this.orgRepo.save(organisation);
    }

    // Récupère toutes les organisations
    async findAll(): Promise<OrganizationEntity[]> {
        return await this.orgRepo.find();
    }

    // Récupère une organisation par ID
    async findOne(id: string): Promise<OrganizationEntity> {
        const org = await this.orgRepo.findOne({ where: { id } });
        if (!org) throw new NotFoundException('Organization not found');
        return org;
    }

    // Met à jour une organisation existante
    async update(id: string, data: Partial<OrganizationEntity>): Promise<OrganizationEntity> {
        // Vérification de l'existence de l'organisation
        const org = await this.findOne(id);

        // Mise à jour des données de l'organisation
        Object.assign(org, data);

        // Sauvegarde et retour de l'organisation mise à jour
        return await this.orgRepo.save(org);
    }

    // Supprime une organisation
    async delete(id: string): Promise<void> {
        // Vérification de l'existence de l'organisation avant la suppression
        const org = await this.findOne(id);

        // Suppression de l'organisation
        await this.orgRepo.remove(org);
    }
}
