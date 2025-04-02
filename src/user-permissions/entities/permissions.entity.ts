/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, Timestamp, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('permissions')
export class PermissionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: 1 })
    status: number;

    @Column({ default: 0 })
    deleted: number;


    @CreateDateColumn()
    createdAt: Timestamp;
    @UpdateDateColumn()
    updatedAt: Timestamp;
}
