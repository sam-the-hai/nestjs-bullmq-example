import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { NOTIFICATION_QUEUE_NAME } from './constants';

@Injectable()
@Processor(NOTIFICATION_QUEUE_NAME)
export class MyProcessor extends WorkerHost {
  public async process(job: Job<any, any, string>): Promise<any> {
    console.log('Process Job', job.name, job.data);
  }
}
