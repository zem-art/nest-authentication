import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto'; // Jika menggunakan 'crypto' untuk hashing
import { InternalServerErrorException } from '@nestjs/common';

export class AuthService {
    static jwtService: any;
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {}

    static async sign_jwt_token(id: string, data: string, configService: ConfigService): Promise<string> {
        try {
            const payload = { hash: createHash('sha256').update(data).digest('hex') };
            const secret = configService.get<string>('jwt.secret');
            const options = {
                expiresIn: '1m',
                issuer: 'boba.com',
                audience: id,
            };

            return new Promise((resolve, reject) => {
                this.jwtService.sign(payload, secret, options, (err, token) => {
                    if (err) {
                        console.error(err.message);
                        reject(new InternalServerErrorException('Failed to sign JWT token'));
                    }
                    resolve(token);
                });
            });
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error during JWT signing');
        }
    }
}
