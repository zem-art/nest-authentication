/**
 * old config connect to database mongodb with mongoose 
 * import { connectToDatabase } from './config/config.mongoose';
*/

import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import DatabaseConfig from "./config/config.database";
import JWTConfig from "./config/config.jwt";
import NestConfig from "./config/config.nest";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
      load : [NestConfig, DatabaseConfig, JWTConfig]
    }),
    AuthModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
