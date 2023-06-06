import {IsString, IsEmail} from 'class-validator';

export class AuthLoginDto{
    @IsEmail()
    email: string;

    @IsString()
    pwd: string;
}