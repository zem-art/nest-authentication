import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, IsDateString, MinLength  } from "class-validator";

export class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(6)
    confirm_password: string;

    @IsPhoneNumber(null)
    no_phone: string;

    @IsDateString()
    @IsNotEmpty()
    date_of_birth: string;

    @IsString()
    @IsNotEmpty()
    address: string;
}

