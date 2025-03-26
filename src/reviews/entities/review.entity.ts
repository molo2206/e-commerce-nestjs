/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { ProductEntity } from "src/products/entities/product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity({ name: 'reviews' })
export class ReviewEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column()
    ratings: number

    @Column()
    comment: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()

    updatedAt: Timestamp;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ManyToOne(type => UserEntity, (user) => user.reviews)
    user: UserEntity;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ManyToOne(type => ProductEntity, (prod) => prod.reviews)
    product: ProductEntity;
}

