import { Body, Controller, Get, Headers, HttpCode, Post} from '@nestjs/common';
import { AuthService } from "./auth.service";
import { SignUpDto } from './dto/sign_up.dto';
import { SignInDto } from './dto/sign_in.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    /**
     * 
     * @param signInData DTO Data transfer object sign in
     * @returns 
     */
    @Post('/sign_in')
    @HttpCode(200)
    async signIn(@Body() signInData : SignInDto) {
        return this.authService.handleSignIn(signInData)
    }

    /**
     * 
     * @param signUpData DTO Data transfer object sign up
     * @returns 
     */
    @Post('/sign_up')
    async signUp(@Body() signUpData : SignUpDto) {
        return await this.authService.handleSignUp(signUpData);
    }

    /**
     * 
     * @param headers Access All Headers at Once
     * @returns 
     */
    @Get('/profile')
    async profileLogin(@Headers() headers : Record<string, string>) {
        return await this.authService.handleProfile(headers)
    }
}
