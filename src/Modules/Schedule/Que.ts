// src/Modules/Schedule/Que.ts
import { QueueScheduler, Queue } from 'bullmq';
import { Config } from '../Config/Config';

export const CheckerQueScheduler = new QueueScheduler('BackupChecker', {
  connection: {
    host: process.env.REDIS_HOST || 'Redis',
  },
});

export const CheckerQue = new Queue<Config>('BackupChecker', {
  connection: {
    host: process.env.REDIS_HOST || 'Redis',
  },
});
