import { Inject, Injectable } from '@nestjs/common';
import { MailDTO } from 'src/dto/mail.dts';
import { DbService } from './db.service';
import { Logger } from 'winston';

@Injectable()
export class MailService {
  constructor(
    private dbService: DbService,
    @Inject('LOGGER') private readonly logger: Logger,
  ) {}

  sendMail = async (mail: MailDTO, jobId?: string): Promise<boolean> => {
    this.logger.info(
      `Processing mail with id ${jobId} for recip: ${mail.recip}...`,
    );
    const isSuccessful = true;
    await new Promise<void>((res) => setTimeout(() => res(), 5000));

    // MAIL LOGIC, TEMPLATING
    // ...
    // ...

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
