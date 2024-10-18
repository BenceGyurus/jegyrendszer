import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestService } from './services/test.service';

@Controller()
export class AppController {
  constructor(private readonly testService: TestService) {}

  @Post('/test')
  getHello(@Body() body): any {
    return this.testService.testMail(body);
  }
}
