import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import keyConfig from './config/key.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache : true,
      load: [keyConfig],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (keyConfig) => ({
        secret: keyConfig.get('jwt.secret'),
        signOptions: { expiresIn: keyConfig.get('jwt.expiresIn') },
      }),
      global: true,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
        imports : [ConfigModule],
        useFactory: async (keyConfig) => ({
        uri: keyConfig.get('database.uri'),
      }),
      inject: [ConfigService],
    }),
   ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
