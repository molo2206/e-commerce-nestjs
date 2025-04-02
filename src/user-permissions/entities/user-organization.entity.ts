/* eslint-disable prettier/prettier */
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Timestamp, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { UserPermissionEntity } from './user-permission.entity';


@Entity('user_has_organization')
export class UserOrganisationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.affectations)
  @JoinColumn({ name: 'userid' })
  user: UserEntity;  // ✅ Correction ici (c'était userid)

  @ManyToOne(() => OrganizationEntity, (org) => org.affectations)
  @JoinColumn({ name: 'orgid' })
  organisation: OrganizationEntity;  // ✅ Correction ici (c'était orgid)

  @OneToMany(() => UserPermissionEntity, (permission) => permission.affectation)
  permissions: UserPermissionEntity[];

  @Column({ default: 1 })
  status: number;

  @Column({ default: 0 })
  deleted: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
