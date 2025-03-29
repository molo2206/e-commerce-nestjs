/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { OrderStatus } from "../enums/order-status-enum";
import { UserEntity } from "src/users/entities/user.entity";
import { ShippingEntity } from "./shipping.entity";
import { OrdersProductsEntity } from "./orders-products.entity";

@Entity({ name: "orders" })
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    orderAt: Timestamp;

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PROCESSING })
    status: string

    @Column()
    shippindAt: Date;

    @Column({ nullable: true })
    deliveredAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.ordersUpdatedBy)
    updatedBy: UserEntity;

    @OneToOne(() => ShippingEntity, (ship) => ship.order, { cascade: true })
    @JoinColumn()
    shippingAddress: ShippingEntity;

    @OneToMany(() => OrdersProductsEntity, (op) => op.order, { cascade: true })
    products: OrdersProductsEntity[]

    @ManyToOne(() => UserEntity, (user) => user.orders)
    user: UserEntity;
}
