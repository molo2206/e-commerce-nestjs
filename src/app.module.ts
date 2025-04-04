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
import { ApiClientsModule } from './api-clients/api-clients.module';
import { HttpClientModule } from './http-client/http-client.module';
import { ExcelModule } from './excel/excel.module';
import { UserPermissionsModule } from './user-permissions/user-permissions.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './users/utility/guards/permissions.guard';
@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), ApiClientsModule, HttpModule, UsersModule, CategoriesModule, ProductsModule, ReviewsModule, OtpModule, OrdersModule, ApiClientsModule, HttpClientModule, ExcelModule, UserPermissionsModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
