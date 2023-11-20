import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';

@Injectable()
@Processor('myQueue')
export class MyProcessor extends WorkerHost {
  public async process(job: Job<any, any, string>): Promise<any> {
    console.log('Process Job', job.name, job.data);
  }
}
