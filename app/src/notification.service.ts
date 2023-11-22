import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationQueueService } from './queue.service';

@Injectable()
export class NotificationService {
  constructor(private readonly queueService: NotificationQueueService) {}

  @Cron('* * * * *', {
    name: 'notifications',
    timeZone: 'Europe/Paris',
  })
  triggerNotifications() {
    return this.queueService.addJob('cron_triggered_job');
  }
}
