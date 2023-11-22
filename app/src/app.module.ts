import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisOptions } from 'ioredis';
import { AppController } from './app.controller';
import { CacheService } from './cache.service';
import { NOTIFICATION_QUEUE_NAME } from './constants';
import { MyProcessor } from './notification-processor.service';
import { NotificationService } from './notification.service';
import { NotificationQueueService } from './queue.service';
import { redisStore } from './redis.store';
import { RedlockService } from './redlock.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          connection: {
            host: config.get('QUEUE_REDIS_HOST', 'redis'),
            port: config.get('QUEUE_REDIS_PORT', 6379),
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE_NAME,
    }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync<RedisOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: config.get('QUEUE_REDIS_HOST', 'redis'),
            port: config.get('QUEUE_REDIS_PORT', 6379),
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    MyProcessor,
    NotificationService,
    NotificationQueueService,
    RedlockService,
    CacheService,
  ],
})
export class AppModule {}
