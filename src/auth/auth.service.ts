import { Model } from 'mongoose';
import { Injectable, HttpStatus, HttpException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SignUpDto } from './dto/sign_up.dto';
import { SignInDto } from './dto/sign_in.dto';
import { User } from './schema/user.schema';
import { JWTServiceMiddleware } from 'src/common/middlewares/jtw-helper.middleware';
import { StringUtil } from 'src/common/utils/string.util';
import { RandomStrUtil } from 'src/common/utils/random_str.utils';
import { throwHttpException } from 'src/common/helpers/exceptions/http-exception.util';
import { AgeUtil } from 'src/common/utils/age.util';

@Injectable()
export class AuthService {
    /**
     * 
     * @param userModel Schema Users
     * @param JWTServiceMiddleware JWTServiceMiddleware: configuration JWT
     */
    constructor(
        @InjectModel(User.name) private userModel : Model<User>,
        private jwtService: JWTServiceMiddleware,
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
            if(!findUser) return throwHttpException('failed', 'sorry user not found or recognize.', HttpStatus.NOT_FOUND)
                

            const isMatchPassword = await findUser.isValidPassword(password)
            if(!isMatchPassword) return throwHttpException('failed', 'sorry the password is not the same or wrong.', HttpStatus.BAD_REQUEST)

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
                message : 'congratulations, you have successfully logged in.',
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

            if(password !== confirm_password) return throwHttpException('failed', 'sorry, password and password confirmation are not the same.', HttpStatus.BAD_REQUEST)

            if(StringUtil.special_character_username(username)) return throwHttpException('failed', 'sorry username cannot contain special characters.', HttpStatus.BAD_REQUEST)

            const existingUser = await this.userModel.findOne({ email: email });
            if(existingUser) return throwHttpException('failed', 'email already registered', HttpStatus.CONFLICT)

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
                message : 'congratulations, you have successfully sign up.'
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param headers request headers
     * @returns 
     */
    async handleProfile(headers : Record<string, string>) {
        try {
            let response = {}
            // Verify the JWT token first
            await this.jwtService.verifyJwtToken(headers)

            const authHeader = headers['authorization']
            if (!authHeader) return throwHttpException('failed', 'authentication token is invalid or has expired.', HttpStatus.UNAUTHORIZED)
            const bearerToken = authHeader.split(' ')
            const token = bearerToken[1]
            const decodedToken = this.jwtService.decodeTokenJwt(token)

            const findUser = await this.userModel.findOne({ id_user : decodedToken.aud })
            if(!findUser) return throwHttpException('failed', 'sorry user not found.', HttpStatus.NOT_FOUND)
            
            response = {
                data : {
                    id_user : findUser.id_user,
                    username : findUser.username,
                    email : findUser.email,
                    no_phone : findUser.no_phone,
                    date_of_birth : findUser.date_of_birth,
                    age : AgeUtil.calculate_age(findUser.date_of_birth),
                    address : findUser.address,
                },
                token,
            }

            return {
                title: 'succeed',
                status_code : 200,
                message : 'successfully retrieve user profile.',
                response
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
