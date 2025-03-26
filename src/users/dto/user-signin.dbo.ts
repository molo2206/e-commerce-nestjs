/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { Roles } from '../utility/common/user-roles.enum';
export class UserSignInDto {
  id: number;
  roles: Roles[];
  name: string;
  createdAt: any;
  updatedAt: any;
  @IsNotEmpty({ message: 'Email cannot be null' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
  @IsNotEmpty({ message: 'Password cannot be null' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
