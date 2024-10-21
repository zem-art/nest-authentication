import { Injectable, HttpStatus, HttpException, InternalServerErrorException } from '@nestjs/common';
import { SignUpDto } from './dto/sign_up.dto';
import { SignInDto } from './dto/sign_in.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StringUtil } from 'src/common/utils/string.util';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel : Model<User>) {}

    async handleSignIn(signInData: SignInDto) {
        try {
            const { username_or_email, password } = signInData
            
            const findUser = await this.userModel.findOne({ $or : [{ username : username_or_email}, { email : username_or_email} ]});
            console.log(findUser);

            return { 
                status: 'succeed',
                status_code : 200,
                message : 'Congratulations, you have successfully logged in.'
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException();
        }
    }

    async handleSignUp(signUpData: SignUpDto) {
        try {
            const { username, email, password, confirm_password, address, date_of_birth, no_phone } = signUpData

            if(password !== confirm_password) {
                throw new HttpException({
                    title : 'failed',
                    status : HttpStatus.BAD_REQUEST,
                    message : 'Sorry, password and password confirmation are not the same.'
                }, HttpStatus.BAD_REQUEST);
            }

            if(StringUtil.special_character_username(username)){
                throw new HttpException({
                    title : 'failed',
                    status : HttpStatus.BAD_REQUEST,
                    message : 'sorry username cannot contain special characters.'
                }, HttpStatus.BAD_REQUEST);
            }

            const existingUser = await this.userModel.findOne({ email: email });
            if(existingUser){
                throw new HttpException({
                    title : 'failed',
                    status : HttpStatus.CONFLICT,
                    message : 'Email already registered.'
                }, HttpStatus.CONFLICT);
            }

            const newUser = new this.userModel({
                ...signUpData,
                no_phone : StringUtil.remove_special_phone_number(no_phone)
            });

            // Save DB
            await newUser.save();

            return {
                title: 'succeed',
                status_code : 200,
                message : 'Congratulations, you have successfully sign up.'
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException();
        }
    }
}
