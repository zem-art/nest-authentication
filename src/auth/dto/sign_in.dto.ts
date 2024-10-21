import { IsString, IsNotEmpty } from "class-validator";

export class SignInDto {
    @IsString()
    @IsNotEmpty()
    username_or_email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

