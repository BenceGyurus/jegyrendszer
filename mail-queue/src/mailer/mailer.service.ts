import { BadRequestException, Injectable } from '@nestjs/common';
import { MailDTO, MailTypes } from 'src/dto/mail.dts';
import { TemplateService } from './template.service';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private readonly templateService: TemplateService) {
    // this.transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.APP_USER,
    //     pass: process.env.APP_PASS,
    //   },
    //   tls: {
    //     ciphers: 'SSLv3',
    //   },
    // });
  }

  sendMail = async (mail: MailDTO): Promise<boolean> => {
    throw new Error('Method not implemented.');

    const template = await this.templateService.createMail(mail);
    const attachments = this.getAttachments(mail.body.fileName);

    const mailType: MailTypes =
      MailTypes[mail.type.toUpperCase() as keyof typeof MailTypes];
    if (mailType == undefined)
      throw new BadRequestException('Invalid mail type');

    const mailMessage = {
      from: process.env.EMAIL_FROM,
      to: mail.recip,
      subject: this.templateService.getMailSubject(
        mail.type,
        mail.body.tickets[0].ticketName,
      ),
      html: template,
      attachments: attachments,
    };

    this.transporter.sendMail(mailMessage, (err: any, info: any) => {
      if (err) {
        console.error(err);
        return false;
      } else return true;
    });

    return false;
  };

  getAttachments = (filePaths: string[]) => {
    return filePaths.map((file) => ({
      filename: file,
      path: `/pdfs/${file}`,
    }));
  };
}
