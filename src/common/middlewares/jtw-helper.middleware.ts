import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class JWTServiceMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    /**
     * 
     * @param token decode token
     * @returns 
     */
    decodeTokenJwt(token: string): any {
        return this.jwtService.decode(token);
    }

    /**
     * 
     * @param headers header from request
     * @returns 
     */
    async verifyJwtToken(headers : Record<string, string>): Promise<any> {
        try {
            if(!headers['authorization']) {
                throw new HttpException({
                    title : 'failed',
                    status : HttpStatus.UNAUTHORIZED,
                    message : 'authentication token is invalid or has expired.'
                }, HttpStatus.UNAUTHORIZED);
            }

            const authHeader = headers['authorization']
            const bearerToken = authHeader.split(' ')
            const token = bearerToken[1]
            const secret = this.configService.get<string>('jwt.secret');
            
            return await this.jwtService.verify(token, {
                ignoreExpiration : false,
                secret,
            })
        } catch (error) {
            // console.error('JWT verify error:', error);
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }
            throw new InternalServerErrorException('Failed to sign JWT token');
        }
    }

    /**
     * 
     * @param id user_id data
     * @param data json stringfy data
     * @returns 
     */
    async signJwtToken(id: string, data: string): Promise<string> {
        try {
            const payload = {
                hash: createHash('sha256').update(data).digest('hex')
            };

            const secret = this.configService.get<string>('jwt.secret');
            const expiresIn = this.configService.get<string>('jwt.expiresIn')
            const issuer = this.configService.get<string>('jwt.issuer')

            if (!secret) throw new InternalServerErrorException('JWT secret not configured');

            const options = {
                expiresIn,
                issuer,
                audience: id,
            };

            // Use Promise with async/await
            return await this.jwtService.signAsync(payload, {
                secret: secret,
                ...options
            });

        } catch (error) {
            console.error('JWT signing error:', error);
            throw new InternalServerErrorException('Failed to sign JWT token');
        }
    }

}