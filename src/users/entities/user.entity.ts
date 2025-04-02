/* eslint-disable prettier/prettier */
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { UserOrganisationEntity } from 'src/user-permissions/entities/user-organization.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
// import { Roles } from '../utility/common/user-roles.enum';
// import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  //@Exclude()
  password: string;
  @Column({ type: 'json', default: '["user"]' }) // JSON pour stocker plusieurs rôles
  roles: string[] | null;
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => CategoryEntity, (cat) => cat.addedBy)
  categories: CategoryEntity[];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => ProductEntity, (prod) => prod.addedBy)
  products: ProductEntity[];

  @OneToMany(() => ReviewEntity, (rev) => rev.user)
  reviews: ReviewEntity[];

  @OneToMany(() => OrderEntity, (order) => order.updatedBy)
  ordersUpdatedBy: OrderEntity[]


  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  // Relation avec Affectation (Un utilisateur peut être affecté à plusieurs organisations)
  @OneToMany(() => UserOrganisationEntity, (affectation) => affectation.user) // ✅ Correction ici
  affectations: UserOrganisationEntity[];

}
