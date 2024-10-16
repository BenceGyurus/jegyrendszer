import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import path from 'path';
import mjml from 'mjml';
import { MailDTO, MailTypes } from 'src/dto/mail.dts';
import Handlebars from 'handlebars';

@Injectable()
export class TemplateService {
  constructor() {}

  createMail = async (mail: MailDTO) => {
    const mailFile = await this.getTemplate(mail.type);

    const compiled = mjml(mailFile, {
      preprocessors: [
        (rawMjml) => {
          const filler = Handlebars.compile(rawMjml);
          const filled = filler(mail.body);
          return filled;
        },
      ],
    });

    return compiled;
  };

  // Get the template file
  private getTemplate = async (mailType: MailTypes) => {
    const templateName = this.getTemplateName(mailType);

    try {
      const file = await readFile(
        path.resolve(__dirname, './templates', `${templateName}.mjml`),
        'utf-8',
      );

      return file;
    } catch (error) {
      console.error(`Error reading email template: ${error}`);
      throw new Error(error);
    }
  };

  // Get the data file
  private getData = async (mailType: MailTypes) => {
    const templateName = this.getTemplateName(mailType);

    try {
      const file = await readFile(
        path.resolve(__dirname, './templates', `${templateName}.json`),
        'utf-8',
      );

      return JSON.parse(file);
    } catch (error) {
      console.error(`Error reading email data: ${error}`);
      throw new Error(error);
    }
  };

  // Get the template name
  private getTemplateName = (mailType: MailTypes): string => {
    switch (mailType) {
      case MailTypes.TICKET:
        return 'ticket';
      case MailTypes.ACC_CONF:
        return 'confirm';
      default:
        throw new Error(`template type doesn't exist: ${mailType}`);
    }
  };

  // Get the mail subject
  getMailSubject = (mailType: MailTypes, data: string): string => {
    switch (mailType) {
      case MailTypes.TICKET:
        return `Jegyvásárlás - ${data}`;
      case MailTypes.ACC_CONF:
        return 'confirm';
      default:
        throw new Error(`template type doesn't exist: ${mailType}`);
    }
  };
}
