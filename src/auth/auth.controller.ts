import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { SignUpDto } from './dto/sign_up.dto';
import { SignInDto } from './dto/sign_in.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @Post('/sign_in')
    async signIn(@Body() signInData : SignInDto) {
        return this.authService.handleSignIn(signInData)
    }

    @Post('/sign_up')
    async signUp(@Body() signUpData : SignUpDto) {
        return this.authService.handleSignUp(signUpData)
    }
}
