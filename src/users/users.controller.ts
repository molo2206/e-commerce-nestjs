/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dbo';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dbo';
import { CurrentUser } from './utility/decorators/current-user-decorator';
import { AuthentificationGuard } from './utility/guards/authentification.guard';
import { Roles } from './utility/common/user-roles.enum';
import { AuthorizeGuard } from './utility/guards/authorization.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signup')
  async signup(
    @Body() userSignUpDto: UserSignUpDto
  ): Promise<{ user: Omit<UserEntity, 'password'> }> {
    const user = await this.usersService.signup(userSignUpDto);
    return { user };
  }

  @Post('signin')
  async signin(@Body() userSignInDto: UserSignInDto) {
    return await this.usersService.signin(userSignInDto);
  }

  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return { message: "Utilisateur supprimé avec succès." };
  }

  @UseGuards(AuthentificationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity) {
    if (!currentUser) {
      throw new UnauthorizedException('Utilisateur non connecté.');
    }
    return currentUser;
  }
}
