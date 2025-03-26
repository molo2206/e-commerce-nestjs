/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<{ user: Omit<UserEntity, 'password'> }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, prettier/prettier
    const user = await this.usersService.signup(userSignUpDto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { user }; // Retourne l'utilisateur sans le mot de passe
  }

  @Post('signin')
  async signin(
    @Body() UserSignInDto: UserSignInDto,
  ): Promise<{ user; accessToken: string }> {
    const user = await this.usersService.signin(UserSignInDto);
    const accessToken = await this.usersService.accessToken(UserSignInDto);
    return { accessToken, user };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthentificationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity) {
    if (!currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }
    return currentUser;
  }
}
