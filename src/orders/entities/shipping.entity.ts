/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity({ name: "shippings" })

export class ShippingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    phone: string;

    @Column({ default: ' ' })
    name: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @OneToOne(() => OrderEntity, (order) => order.shippingAddress)
    order: OrderEntity

}