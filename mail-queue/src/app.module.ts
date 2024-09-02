import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { MailService } from './services/mail.service';
import { QueueService } from './services/queue.service';
import { TestService } from './services/test.service';
import { MailProcessor } from './processors/mail.proc';
import { MAIL_QUEUE } from './constants/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { Mail, MailSchema } from './schemas/mail.schema';
import { DbService } from './services/db.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO),
    MongooseModule.forFeature([{ name: Mail.name, schema: MailSchema }]),
    BullModule.forRoot({
      connection: {
        host:
          process.env.NODE_ENV == 'development'
            ? 'localhost'
            : process.env.REDIS,
        port: 6379,
        db: 1,
        username: 'default',
        password: process.env.REDIS_PASS,
      },
      defaultJobOptions: {
        delay: 2000,
        removeOnComplete: 1000,
        removeOnFail: 5000,
        attempts: 10,
      },
      settings: {},
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  controllers: [AppController],
  providers: [
    MailProcessor,
    AppService,
    DbService,
    MailService,
    QueueService,
    TestService,
  ],
})
export class AppModule {}
