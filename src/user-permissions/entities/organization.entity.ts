/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Timestamp, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { UserOrganisationEntity } from './user-organization.entity';


@Entity('organizations')
export class OrganizationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    description: string;

    @Column()
    sigle: string;

    @Column()
    logo: string;

    @Column()
    adresse: string;

    @Column()
    activite: string;

    @Column()
    pointfocal: string;

    @Column()
    category: string;

    @Column({ type: 'int', default: 1 })
    status: number;

    @Column({ type: 'int', default: 0 })
    delete: number;


    @CreateDateColumn()
    createdAt: Timestamp;
    @UpdateDateColumn()
    updatedAt: Timestamp;

    // Relation avec Affectation (Une organisation a plusieurs affectations)
    @OneToMany(() => UserOrganisationEntity, (userOrg) => userOrg.organisation)
    affectations: UserOrganisationEntity[];
}
