import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class JWTService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

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