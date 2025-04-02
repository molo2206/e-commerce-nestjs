/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from './entities/permissions.entity';


@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(PermissionEntity)
        private readonly permRepo: Repository<PermissionEntity>
    ) { }

    async create(data: Partial<PermissionEntity>): Promise<PermissionEntity> {
        if (!data.name) {
            throw new BadRequestException('Permission name is required');
        }

        const existingPermission = await this.permRepo.findOne({ where: { name: data.name } });
        if (existingPermission) {
            throw new BadRequestException('Permission already exists');
        }

        const permission = this.permRepo.create(data);
        return await this.permRepo.save(permission);
    }

    async findAll(): Promise<PermissionEntity[]> {
        return await this.permRepo.find();
    }

    async findOne(id: string): Promise<PermissionEntity> {
        const permission = await this.permRepo.findOne({ where: { id } });
        if (!permission) {
            throw new BadRequestException('Permission not found');
        }
        return permission;
    }

    async update(id: string, data: Partial<PermissionEntity>): Promise<PermissionEntity> {
        const permission = await this.findOne(id);
        Object.assign(permission, data);
        return await this.permRepo.save(permission);
    }

    async delete(id: string): Promise<void> {
        const permission = await this.findOne(id);
        await this.permRepo.remove(permission);
    }
}
