import { BadRequestException, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { SignUpDto } from './dto/sign_up.dto';
import { SignInDto } from './dto/sign_in.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel : Model<User>) {}

    handleSignIn(signInData: SignInDto):object {
        const { username, password } = signInData
        console.log(signInData)

        return {
            status: 'succeed',
            status_code : 200,
            message : 'Congratulations, you have successfully logged in.'
        }
    }

    async handleSignUp(signUpData: SignUpDto) {
        try {
            const { username, password, confirm_password, email, address, date_of_birth, no_phone } = signUpData

            if(password !== confirm_password) {
                console.log(password !== confirm_password);
                // throw new Error('Sorry, password and password confirmation are not the same.');
                throw new HttpException({
                    status: 'failed',
                    status_code: 400,
                    message: 'Username already exists'
                }, HttpStatus.BAD_REQUEST);
            }

            console.log(2);
            

            // const findUser = await this.userModel.findOne({ email });
            // console.log(findUser);
            // if(findUser) throw new BadRequestException('sorry password and password confirmation are not the same.')

            // const newUser = new this.userModel({
            //     ...signUpData
            // });

            // // Simpan ke database
            // await newUser.save();

            return {
                status: 'succeed',
                status_code : 200,
                message : 'Congratulations, you have successfully sign up.'
            }
        } catch (error) {
            
        }
    }
}
