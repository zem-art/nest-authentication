export class CreateUserDto {
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly confirm_password: string;
    readonly no_phone: string;
    readonly date_of_birth: string;
    readonly address: string;
}