import { Module } from '@nestjs/common';
import { EmailServiceService } from './email-service.service';
import { EmailServiceController } from './email-service.controller';
import { ConfigModule } from '@nestjs/config';
import { TemplateService } from './templates/template.service';

@Module({
  imports: [ConfigModule],
  controllers: [EmailServiceController],
  providers: [EmailServiceService , TemplateService],
  exports : [EmailServiceService]
})
export class EmailServiceModule {}
