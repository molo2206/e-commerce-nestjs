/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { OrdersProductsEntity } from 'src/orders/entities/orders-products.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { ImageEntity } from './image.entity';
import { Transform } from 'class-transformer';


@Entity({ name: 'products' })
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @Column()
    stock: number;

    @CreateDateColumn()
    createdAt: Timestamp;

    @CreateDateColumn()
    updatedAt: Timestamp;

    @ManyToOne(() => UserEntity, (user) => user.products)
    addedBy: UserEntity;

    @ManyToOne(() => CategoryEntity, (cat) => cat.products)
    categoryId: CategoryEntity;

    @OneToMany(() => ReviewEntity, (rev) => rev.product)
    reviews: ReviewEntity;

    @OneToMany(() => OrdersProductsEntity, (op) => op.product)
    products: OrdersProductsEntity[];


    @OneToMany(() => ImageEntity, (image) => image.product, { cascade: true })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    @Transform(({ value }) => value.map(image => ({ id: image.id, url: image.url })), { toPlainOnly: true }) 
    images: ImageEntity[];
}