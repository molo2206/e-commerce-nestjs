/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationEntity } from './entities/organization.entity';
import { PermissionEntity } from './entities/permissions.entity';
import { UserOrganisationEntity } from './entities/user-organization.entity';
import { UserPermissionEntity } from './entities/user-permission.entity';
import { UserPermissionsController } from './user-permissions.controller';
import { OrganizationService } from './organization.service';
import { PermissionService } from './permission.service';
import { UserOrganizationService } from './user-organisation.service';
import { UserPermissionService } from './user-permissions.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';
import { OtpEntity } from 'src/otp/entities/otp.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
      UserEntity,
      OtpEntity,
      OrganizationEntity,
      PermissionEntity,
      UserOrganisationEntity,
      UserPermissionEntity,
    ]),
  ],
  controllers: [
    UserPermissionsController,
    UsersController
  ],
  providers: [
    UsersService,
    OrganizationService,
    PermissionService,
    UserOrganizationService,
    UserPermissionService,
  ],
})
export class UserPermissionsModule { }
