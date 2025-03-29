/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductEntity } from './product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class ImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string; // Stocke le chemin ou l'URL de l'image

    @ManyToOne(() => ProductEntity, (product) => product.images, { onDelete: 'CASCADE' })
    @Exclude() // Empêche la boucle infinie lors de la conversion JSON
    product: ProductEntity;
}
