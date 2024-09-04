import { Injectable } from '@nestjs/common';
import { QueueService } from './queue.service';

@Injectable()
export class TestService {
  constructor(private queueService: QueueService) {}

  addToQueue = (): string => {
    this.queueService.addToQueue();
    return 'okay';
  };
}
