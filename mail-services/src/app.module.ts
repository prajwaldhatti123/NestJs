import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailServiceModule } from './email-service/email-service.module';
import { ConfigModule } from '@nestjs/config';
import keyConfig from './Config/key.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load : [keyConfig]
    }),
    EmailServiceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
