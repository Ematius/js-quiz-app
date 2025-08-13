import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto{

    @IsNotEmpty()
    acc: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    pass: string;

}