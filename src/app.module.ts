/* eslint-disable prettier/prettier */
import { dataSourceOptions } from 'db/data-source';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './users/utility/middlewares/current-user.middleware';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OtpModule } from './otp/otp.module';
import { OrdersModule } from './orders/orders.module';
import { HttpModule } from '@nestjs/axios';
import { AlertApiModule } from './alert-api/alert-api.module';
@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions),HttpModule, UsersModule, CategoriesModule, ProductsModule, ReviewsModule, OtpModule, OrdersModule, AlertApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
