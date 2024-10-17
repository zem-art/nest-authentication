import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({ imports : [
    MongooseModule.forRootAsync({
        imports : [ConfigModule],
        useFactory(configService: ConfigService) {
            const dbUrl = configService.get<string>('database.url');
            const dbPort = configService.get<string>('database.port');
            const dbUser = configService.get<string>('database.user');
            const dbPassword = configService.get<string>('database.password');
            const dbName = 'nest-test'

            // Add query parameter for authentication
            const authParams = new URLSearchParams({
                directConnection: 'true', // Force direct connection to MongoDB server without trying to find replica set
                appName: 'nest-authentication',  // Replace with your application name
                authMechanism: 'DEFAULT',
                authSource : 'admin'
            }).toString();

            // Format URL with credentials if any
            const urlName = dbUser && dbPassword
                ? `mongodb://${dbUser}:${dbPassword}@${dbUrl}:${dbPort}/${dbName}?${authParams}`
                : `mongodb://${dbUrl}:${dbPort}/${dbName}`;

            return {
                uri : urlName,
                autoCreate: true,
            };
        },
        inject: [ConfigService],
    })
]})
export class DatabaseModule {}
