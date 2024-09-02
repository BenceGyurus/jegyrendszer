import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailDTO } from 'src/dto/mail.dts';
import { Mail, MailDocument } from 'src/schemas/mail.schema';

@Injectable()
export class DbService {
  constructor(
    @InjectModel(Mail.name) private readonly mailDb: Model<MailDocument>,
  ) {}

  logMail = async (mail: MailDTO, completed = false, jobId?: number) =>
    this.mailDb.create({
      created: new Date(),
      completed: completed,
      jobId: jobId,
      mail: mail,
    });
}
