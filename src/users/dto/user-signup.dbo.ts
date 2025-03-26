/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserSignInDto } from './user-signin.dbo';

export class UserSignUpDto extends UserSignInDto {
  @IsNotEmpty({ message: 'Name cannot be null' })
  @IsString({ message: 'Name should be a string' })
  name: string;
  // eslint-disable-next-line prettier/prettier
  @IsOptional()
  @IsString()
  otpCode?: string; 
  
}
