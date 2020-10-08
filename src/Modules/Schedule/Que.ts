// src/Modules/Schedule/Que.ts
import Bull from 'bull';
import { Config } from '../Config/Config';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const CheckerQue = new Bull<Config>('BackupChecker', {
  redis: {
    host: process.env.REDIS_HOST || 'Redis',
  },
});
