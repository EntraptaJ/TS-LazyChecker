// src/Modules/Schedule/Que.ts
import Bull from 'bull';
import { Config } from '../Config/Config';

export const CheckerQue = new Bull<Config>('BackupChecker', {
  redis: {
    host: process.env.REDIS_HOST || 'Redis',
  },
});
