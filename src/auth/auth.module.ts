import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JWTServiceMiddleware } from 'src/common/middlewares/jtw-helper.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports : [
    MongooseModule.forFeature([
      {
        name : User.name,
        schema : UserSchema,
      }
    ]),
    JwtModule.registerAsync({
      imports : [ConfigModule],
      useFactory : async (configService : ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
          issuer: configService.get<string>('jwt.issuer'),
        },
      }),
      inject : [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [JWTServiceMiddleware, AuthService],
  exports : [JWTServiceMiddleware]
})
export class AuthModule {}
