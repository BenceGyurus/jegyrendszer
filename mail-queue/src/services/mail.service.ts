import { Injectable } from '@nestjs/common';
import { MailDTO } from 'src/dto/mail.dts';
import { DbService } from './db.service';

@Injectable()
export class MailService {
  constructor(private dbService: DbService) {}

  sendMail = async (mail: MailDTO, jobId?: string): Promise<boolean> => {
    const isSuccessful = true;
    await new Promise<void>((res) => setTimeout(() => res(), 5000));

    await this.dbService.logMail(
      mail,
      isSuccessful,
      jobId as unknown as number,
    );

    return isSuccessful;
  };
}
