/* eslint-disable prettier/prettier */
import { ProductEntity } from "src/products/entities/product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity({ name: 'categories' })
export class CategoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @ManyToOne(() => UserEntity, (user) => user.categories, { nullable: false })
    addedBy: UserEntity;
    
    @OneToMany(() => ProductEntity, (prod) => prod.addedBy)
    products: ProductEntity[];
}

