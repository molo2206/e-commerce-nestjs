/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrganizationEntity } from './entities/organization.entity';
import { PermissionEntity } from './entities/permissions.entity';
import { UserOrganisationEntity } from './entities/user-organization.entity';
import { UserPermissionEntity } from './entities/user-permission.entity';
import { UserPermissionService } from './user-permissions.service';
import { UserOrganizationService } from './user-organisation.service';
import { PermissionService } from './permission.service';
import { OrganizationService } from './organization.service';

@Controller('user-permissions')
export class UserPermissionsController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly permissionService: PermissionService,
    private readonly userOrganisationService: UserOrganizationService,
    private readonly userPermissionService: UserPermissionService,
  ) { }

  // ----------------- Organization Routes -----------------

  @Post('organizations')
  async createOrganization(@Body() data: Partial<OrganizationEntity>): Promise<OrganizationEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return await this.organizationService.create(data);
  }

  @Get('organizations')
  async findAllOrganizations(): Promise<OrganizationEntity[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return await this.organizationService.findAll();
  }

  @Get('organizations/:id')
  async findOneOrganization(@Param('id') id: string): Promise<OrganizationEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return await this.organizationService.findOne(id);
  }

  // ----------------- Permission Routes -----------------

  @Post('permissions')
  async createPermission(@Body() data: Partial<PermissionEntity>): Promise<PermissionEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return await this.permissionService.create(data);
  }

  @Get('permissions')
  async findAllPermissions(): Promise<PermissionEntity[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return await this.permissionService.findAll();
  }

  @Get('permissions/:id')
  async findOnePermission(@Param('id') id: string): Promise<PermissionEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return await this.permissionService.findOne(id);
  }

  // ----------------- User-Organization Routes -----------------

  @Post('userorganization')
  async assignUserToOrg(@Body() { userId, orgId }: { userId: number, orgId: string }): Promise<UserOrganisationEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return await this.userOrganisationService.assignUserToOrg(userId, orgId);
  }




  // ----------------- User-Permission Routes -----------------
  @Post('user-permissions')
  async assignPermissionToUser(@Body() data: { affectationId: string, permissionId: string, actions: Partial<UserPermissionEntity> }): Promise<UserPermissionEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return await this.userPermissionService.assignPermission(data.affectationId, data.permissionId, data.actions);
  }
}
