import { IsNotEmpty }   from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty()
    acc: string;

    @IsNotEmpty()
    pass: string;
}