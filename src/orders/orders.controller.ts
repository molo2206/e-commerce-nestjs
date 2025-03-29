/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, UseGuards, NotFoundException, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/users/utility/decorators/current-user-decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthentificationGuard } from 'src/users/utility/guards/authentification.guard';
import { OrderEntity } from './entities/order.entity';
import { AuthorizeGuard } from 'src/users/utility/guards/authorization.guard';
import { Roles } from 'src/users/utility/common/user-roles.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(AuthentificationGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() currentUser: UserEntity): Promise<OrderEntity | null> {
    const order = await this.ordersService.create(createOrderDto, currentUser);
    if (!order) throw new NotFoundException('La commande n\'a pas pu être créée.');
    return order;
  }

  @Get()
  async findAll(): Promise<OrderEntity[]> {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderEntity | null> {
    return await this.ordersService.findOne(id);
  }

  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto, @CurrentUser()
  currentUser: UserEntity) {
    return await this.ordersService.update(id, updateOrderStatusDto, currentUser);
  }

  @Put('cancel/:id')
  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  async cancelled(@Param('id') id: string, @CurrentUser() currentUser: UserEntity) {
    return await this.ordersService.cancelled(id, currentUser)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
