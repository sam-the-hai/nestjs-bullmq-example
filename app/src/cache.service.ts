// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  client() {
    return (
      this.cacheManager.store as Cache['store'] & {
        client: Redis;
      }
    ).client;
  }
}
