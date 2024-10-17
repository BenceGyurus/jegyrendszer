import { BadRequestException, Injectable } from '@nestjs/common';
import { MailDTO, MailTypes } from 'src/dto/mail.dts';
import { TemplateService } from './template.service';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private readonly templateService: TemplateService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });
  }

  sendMail = async (mail: MailDTO): Promise<boolean> => {
    const template = await this.templateService.createMail(mail);
    const attachments = this.getAttachments(mail.body.fileName);

    // const mailType: MailTypes =
    //   MailTypes[mail.type.toUpperCase() as keyof typeof MailTypes];
    const mailType: MailTypes = MailTypes[mail.type.toUpperCase()];
    if (mailType == undefined)
      throw new BadRequestException('Invalid mail type');

    const mailMessage = {
      from: process.env.APP_USER,
      to: mail.recip,
      subject: this.templateService.getMailSubject(
        mailType,
        mail.body.tickets[0].ticketName,
      ),
      html: template.html,
      attachments: attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailMessage);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  getAttachments = (filePaths: string[]) => {
    return filePaths.map((file) => ({
      filename: file,
      path: `/pdfs/${file}`,
    }));
  };
}
