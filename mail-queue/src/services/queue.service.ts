import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { MAIL_QUEUE } from 'src/constants/constants';
import { MailDTO, MailTypes } from 'src/dto/mail.dts';

@Injectable()
export class QueueService {
  constructor(@InjectQueue(MAIL_QUEUE) private mailQueue: Queue) {}

  addToQueue = async (): Promise<void> => {
    const mailData: MailDTO = {
      type: MailTypes.TICKET,
      recip: 'asdasd@asdasd.com',
      body: {
        name: 'Teszt Janos',
        fileName: 'xxx.pdf',
        ticketName: 'X Előadás',
        ticketType: 'Normál',
        ticketQty: 5,
        ticketDate: '2025-01-01',
      },
    };
    await this.mailQueue.add('send', mailData);
  };
}
