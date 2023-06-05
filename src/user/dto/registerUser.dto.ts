import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail(undefined, {message: 'Email musi zawierać znak @'})
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @MinLength(3)
  @IsNotEmpty()
  pwd: string;
}