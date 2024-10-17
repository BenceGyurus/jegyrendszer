import { Injectable } from '@nestjs/common';
import { QueueService } from './queue.service';
import { MailerService } from 'src/mailer/mailer.service';
import { MailTypes } from 'src/dto/mail.dts';
import { MailService } from './mail.service';

@Injectable()
export class TestService {
  constructor(
    private mailer: MailerService,
    private mail: MailService,
  ) {}

  addToQueue = (): string => {
    return 'okay';
  };

  testMail = async (body: any): Promise<any> => {
    // this.mailer.sendMail({
    //   body: {
    //     fileName: ['asd.pdf'],
    //     name: 'Mr János',
    //     tickets: [
    //       {
    //         ticketName: 'Előadás 1',
    //         ticketDate: '2020-01-01',
    //         ticketQty: 4,
    //         ticketType: 'Normál',
    //       },
    //     ],
    //   },
    //   recip: 'test@test.com',
    //   type: MailTypes.TICKET,
    // });
    return await this.mail.sendMail(body, '00');
  };
}
