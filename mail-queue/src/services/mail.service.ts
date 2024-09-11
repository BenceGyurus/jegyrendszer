import { Inject, Injectable } from '@nestjs/common';
import { MailDTO } from 'src/dto/mail.dts';
import { DbService } from './db.service';
import { Logger } from 'winston';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class MailService {
  constructor(
    private dbService: DbService,
    private mailer: MailerService,
    @Inject('LOGGER') private readonly logger: Logger,
  ) {}

  sendMail = async (mail: MailDTO, jobId?: string): Promise<boolean> => {
    this.logger.info(
      `Processing mail with id ${jobId} for recip: ${mail.recip}...`,
    );
    await new Promise<void>((res) => setTimeout(() => res(), 5000));

    const isSuccessful = await this.mailer.sendMail(mail);

    const dbId = await this.dbService.logMail(
      mail,
      isSuccessful,
      jobId as unknown as number,
    );
    if (isSuccessful)
      this.logger.info(
        `Successfully created ticket for ${mail.recip}, db entry: ${dbId._id}`,
      );
    else
      this.logger.error(
        `Ticket creation failed for ${mail.recip}, db entry: ${dbId._id}`,
      );
    return isSuccessful;
  };
}
