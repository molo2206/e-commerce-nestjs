/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEntity } from "./permissions.entity";
import { UserOrganisationEntity } from "./user-organization.entity";

@Entity('user_permissions')
export class UserPermissionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserOrganisationEntity, (affectation) => affectation.permissions)
    @JoinColumn({ name: 'affectation_id' })
    affectation: UserOrganisationEntity;

    @ManyToOne(() => PermissionEntity)
    @JoinColumn({ name: 'permission_id' })
    permission: PermissionEntity;

    @Column({ default: false }) create: boolean;
    @Column({ default: false }) update: boolean;
    @Column({ default: false }) delete: boolean;
    @Column({ default: false }) read: boolean;
    @Column({ default: true }) status: boolean;
}
