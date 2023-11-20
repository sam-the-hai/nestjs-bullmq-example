import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class AppService {
  constructor(@InjectQueue('myQueue') private messageQueue: Queue) {}

  public async addJob(id: number): Promise<string> {
    const job = await this.messageQueue.add('myJob', { id });
    console.log('Job Added', id, job.name, job.queueName);
    return `Job Added ${id}`;
  }
}
