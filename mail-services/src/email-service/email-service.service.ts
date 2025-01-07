import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEmailServiceDto } from './dto/create-email-service.dto';
import { UpdateEmailServiceDto } from './dto/update-email-service.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailServiceService {
  private transporter : nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.password'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('email.from'),
      to,
      subject,
      text,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendOtpMail(to: string, subject: string, text: string, html?: string): Promise<string> {
    const mailOptions = {
      from: this.configService.get<string>('email.from'),
      to,
      subject,
      text,
      html,
    };

    try {
      // await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${to}`);
      return this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new InternalServerErrorException('Failed to send OTP email');
    }
  }
}
