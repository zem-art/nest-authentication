import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @Post('/signIn')
    async signIn(@Body() signData : { username:string, password:string }) {
        return this.authService.handleSignIn(signData)
    }
}
