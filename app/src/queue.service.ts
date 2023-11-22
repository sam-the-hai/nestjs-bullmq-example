import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CacheService } from './cache.service';
import { NOTIFICATION_QUEUE_NAME } from './constants';

@Injectable()
export class NotificationQueueService {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE_NAME) private queue: Queue,
    private cacheService: CacheService,
  ) {}

  private async generateQueueId(): Promise<number> {
    const cacheClient = this.cacheService.client();
    const [, result] = await cacheClient
      .multi()
      .incr('notification-key')
      .get('notification-key')
      .exec();

    const newId = Number(result);
    return newId;
  }

  public async addJob(name: string): Promise<string> {
    const id = await this.generateQueueId();
    const job = await this.queue.add(`${name}_${id}`, { id });

    console.log('Job Added', id, job.name, job.queueName);
    return `Job Added ${id}`;
  }
}
