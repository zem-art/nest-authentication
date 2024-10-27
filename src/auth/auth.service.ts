import { Model } from 'mongoose';
import { Injectable, HttpStatus, HttpException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SignUpDto } from './dto/sign_up.dto';
import { SignInDto } from './dto/sign_in.dto';
import { User } from './schema/user.schema';
import { JWTService } from 'src/common/middlewares/jtw-helper.middleware';
import { StringUtil } from 'src/common/utils/string.util';
import { RandomStrUtil } from 'src/common/utils/random_str.utils';

@Injectable()
export class AuthService {
    /**
     * 
     * @param userModel Schema Users
     * @param jwtService JWTservice: configuration JWT
     */
    constructor(
        @InjectModel(User.name) private userModel : Model<User>,
        private jwtService: JWTService
    ) {}

    /**
     * 
     * @param userId id_user
     * @param param object data
     * @returns 
     */
    async generateToken(userId: string, param:string) {
        return this.jwtService.signJwtToken(userId, param);
    }

    /**
     * 
     * @param signInData DTO sign in
     * @returns 
     */
    async handleSignIn(signInData: SignInDto) {
        try {
            const { username_or_email, password } = signInData
            let response = {}
            
            const findUser = await this.userModel.findOne({ $or : [{ username : username_or_email}, { email : username_or_email} ]});
            if(!findUser) {
                throw new HttpException({
                    title : 'failed',
                    status : HttpStatus.NOT_FOUND,
                    message : 'Sorry user not found or recognize',
                }, HttpStatus.NOT_FOUND)
            }

            const isMatchPassword = await findUser.isValidPassword(password)
            console.log(isMatchPassword);
            if(!isMatchPassword) {
                throw new HttpException({
                    title : 'failed',
                    status : HttpStatus.BAD_REQUEST,
                    message : 'Sorry the password is not the same or wrong',
                }, HttpStatus.BAD_REQUEST)
            }

            const token_jwt = await this.generateToken(findUser.id_user, JSON.stringify({
                username: findUser.username,
                date: findUser.date_of_birth
            }));
            
            response = {
                data : {
                    id_user: findUser.id_user,
                    username: findUser.username,
                    email: findUser.email,
                    no_phone: findUser.no_phone,
                    date_of_birth: findUser.date_of_birth,
                    address: findUser.address,
                },
                token : token_jwt,
            }

            return { 
                status: 'succeed',
                status_code : 200,
                message : 'Congratulations, you have successfully logged in.',
                response,
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param signUpData DTO sign up
     * @returns 
     */
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

            let newUser = new this.userModel({
                ...signUpData,
                id_user : RandomStrUtil.random_str_number(7),
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
            throw new InternalServerErrorException(error.message);
        }
    }
}
