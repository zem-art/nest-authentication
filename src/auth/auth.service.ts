import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    handleSignIn(signData: { username: string; password: string; }):any {
        const { username, password } = signData

        if(!username || !password) throw new BadRequestException('username or password is empty')

        return {
            status: 'succeed',
            status_code : 200,
            message : 'Congratulations, you have successfully logged in.'
        }
    }
}
