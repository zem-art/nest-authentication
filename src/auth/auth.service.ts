import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign_up.dto';
import { SignInDto } from './dto/sign_in.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    // constructor(@Injectable(User.name) private userModel : Model<User>) {}


    handleSignIn(signInData: SignInDto):object {
        const { username, password } = signInData
        console.log(signInData)

        return {
            status: 'succeed',
            status_code : 200,
            message : 'Congratulations, you have successfully logged in.'
        }
    }

    handleSignUp(signUpData: SignUpDto):object {
        const { username, password, confirm_password, email, address, date_of_birth, no_phone } = signUpData

        if(password != confirm_password) throw new BadRequestException('sorry password and password confirmation are not the same.')

        console.log(signUpData);

        return {
            status: 'succeed',
            status_code : 200,
            message : 'Congratulations, you have successfully sign up.'
        }
    }
}
