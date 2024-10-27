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
            const dbPassword = configService.get<string>('database.pass');
            const dbDirect = configService.get<string>('database.direct');
            const dbAuth = configService.get<string>('database.auth');
            const dbName = configService.get<string>('database.name');

            // Add query parameter for authentication
            const authParams = new URLSearchParams({
                directConnection: dbDirect, // Force direct connection to MongoDB server without trying to find replica set
                authSource : dbAuth,
            }).toString();

            // Format URL with credentials if any
            const urlName = dbUser && dbPassword
                ? `mongodb://${dbUser}:${dbPassword}@${dbUrl}:${dbPort}/${dbName}?${authParams}`
                : `mongodb://${dbUrl}:${dbPort}/${dbName}`;
            // console.log(urlName);
            return {
                uri : urlName,
                autoCreate: true,
            };
        },
        inject: [ConfigService],
    })
]})
export class DatabaseModule {}
