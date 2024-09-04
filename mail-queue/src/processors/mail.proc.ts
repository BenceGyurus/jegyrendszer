import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { MAIL_QUEUE } from 'src/constants/constants';
import { MailService } from 'src/services/mail.service';
import { Logger } from 'winston';

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  constructor(
    private mailService: MailService,
    @Inject('LOGGER') private readonly logger: Logger,
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'send':
        const sent = await this.mailService.sendMail(job.data, job.id);
        await job.updateProgress(sent ? 100 : 0);
        if (sent) return sent;
        else throw new Error(`failed to send ticket with job id: ${job.id}`);
      default:
        break;
    }
    return {};
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name}...`);
  }
  @OnWorkerEvent('failed')
  onFailed(job: Job, error) {
    console.error(`Job ${job.id} failed due to ${error}!`);
  }
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} has completed with progress ${job.progress}!`);
  }
}
