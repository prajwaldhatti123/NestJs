import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Res, HttpStatus } from '@nestjs/common';
import { EmailServiceService } from './email-service.service';
import { CreateEmailServiceDto } from './dto/create-email-service.dto';
import { UpdateEmailServiceDto } from './dto/update-email-service.dto';
import { TemplateService } from './templates/template.service';
import { Response } from 'express';

@Controller('email-service')
export class EmailServiceController {
  constructor(
    private readonly emailServiceService: EmailServiceService,
    private readonly templateService: TemplateService,
  ) {}

  @Post("sendMail")
  sendMail(@Body() createEmailServiceDto: CreateEmailServiceDto) {
    return this.emailServiceService.sendMail(
    createEmailServiceDto.to, 
    'Test Email from NestJS',
    'This is a test email sent from NestJS using Gmail.',
    '<p>This is a test email sent from <b>NestJS</b> using Gmail.</p>',);
  }

  @Post("sendOtpMail")
  @UsePipes(new ValidationPipe())
  async sendOtpMail(@Body() createEmailServiceDto: CreateEmailServiceDto , @Res() res : Response) {
    const templatePath = `/home/hp/workspace/Backend/mail-services/src/email-service/templates/dummy-email-otp.template.hbs`;
    // this below template path will only work when handlebar files are present in dist file
    // const templatePath = `${__dirname}/templates/dummy-email-otp.template.hbs`; 
    const html  = await this.templateService.compileTemplate(templatePath, {
      appName: 'Prajwal dhatti Email Services',
      otp: '923684',
      userName : 'Prajwal Dhatti',
      year : new Date().getFullYear(),
    });
      const result =  await this.emailServiceService.sendOtpMail(
      createEmailServiceDto.to, 
      'Test Email from NestJS',
      'This is a test email sent from NestJS using Gmail.Your OTP for Verification',
       html
    );
    res.status(200).send(result);
  }

}
