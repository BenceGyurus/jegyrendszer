import { Injectable } from '@nestjs/common';
import { MailDTO } from 'src/dto/mail.dts';
import { TemplateService } from './template.service';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private readonly templateService: TemplateService) {
    // this.transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   secure: true,
    //   auth: {
    //     user: process.env.APP_EMAIL,
    //     pass: process.env.APP_PASS,
    //   },
    // });
  }

  sendMail = async (mail: MailDTO): Promise<boolean> => {
    const template = await this.templateService.createMail(mail);

    // const mailMessage = {
    //   from: process.env.EMAIL_FROM,
    //   to: mail.recip,
    //   subject: this.templateService.getMailSubject(
    //     mail.type,
    //     mail.body.ticketName,
    //   ),
    //   html: template,
    // };

    // this.transporter.sendMail(mailMessage, (err, info) => {
    //   if (err) {
    //     console.error(err);
    //     return false;
    //   } else return true;
    // });

    return false;
  };
}
