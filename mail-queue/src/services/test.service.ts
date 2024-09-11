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
        fileName: 'asd',
        name: 'Mr János',
        ticketDate: '2020-01-01',
        ticketName: 'Teszt előadás',
        ticketQty: 3,
        ticketType: 'Normál',
      },
      recip: 'test@test.com',
      type: MailTypes.TICKET,
    });
    return 'okay';
  };
}
