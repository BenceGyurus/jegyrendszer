import { Injectable } from '@nestjs/common';
import { QueueService } from './queue.service';
import { MailerService } from 'src/mailer/mailer.service';
import { MailTypes } from 'src/dto/mail.dts';

@Injectable()
export class TestService {
  constructor(private mailer: MailerService) {}

  addToQueue = (): string => {
    return 'okay';
  };

  testMail = (): string => {
    this.mailer.sendMail({
      body: {
        fileName: ['asd.pdf'],
        name: 'Mr János',
        tickets: [
          {
            ticketName: 'Előadás 1',
            ticketDate: '2020-01-01',
            ticketQty: 4,
            ticketType: 'Normál',
          },
        ],
      },
      recip: 'test@test.com',
      type: MailTypes.TICKET,
    });
    return 'okay';
  };
}
