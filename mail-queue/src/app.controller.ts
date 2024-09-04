import { Controller, Get } from '@nestjs/common';
import { TestService } from './services/test.service';

@Controller()
export class AppController {
  constructor(private readonly testService: TestService) {}

  @Get('/test')
  getHello(): string {
    return this.testService.addToQueue();
  }
}
