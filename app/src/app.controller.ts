import { Controller, Get } from '@nestjs/common';
import { NotificationQueueService } from './queue.service';

@Controller()
export class AppController {
  constructor(private readonly queueService: NotificationQueueService) {}

  @Get()
  public addJob(): Promise<string> {
    return this.queueService.addJob('http_triggered_job');
  }
}
