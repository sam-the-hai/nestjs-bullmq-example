import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Client from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class RedlockService {
  redis: Client;
  redlock: Redlock;
  notificationLockKey = 'NOTIFICATION_LOCK';

  constructor(private readonly configService: ConfigService) {
    this.redis = new Client({
      host: configService.get('QUEUE_REDIS_HOST', 'redis'),
      port: configService.get('QUEUE_REDIS_PORT', 6379),
    });

    this.redlock = new Redlock(
      // You should have one client for each independent redis node
      // or cluster.
      [this.redis],
      {
        // The expected clock drift; for more details see:
        // http://redis.io/topics/distlock
        driftFactor: 0.01, // multiplied by lock ttl to determine drift time

        // The max number of times Redlock will attempt to lock a resource
        // before erroring.
        retryCount: 10,

        // the time in ms between attempts
        retryDelay: 200, // time in ms

        // the max time in ms randomly added to retries
        // to improve performance under high contention
        // see https://www.awsarchitectureblog.com/2015/03/backoff.html
        retryJitter: 200, // time in ms

        // The minimum remaining time on a lock before an extension is automatically
        // attempted with the `using` API.
        automaticExtensionThreshold: 500, // time in ms
      },
    );
  }

  aquireNotificationLock(time: number) {
    return this.redlock.acquire([this.notificationLockKey], time);
  }
}
