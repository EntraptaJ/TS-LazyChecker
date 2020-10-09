// src/Modules/Schedule/Scheduler.ts
import { Job } from 'bull';
import { logger, LogMode } from '../../Library/Logging';
import { postCardMessageToTeams } from '../../Library/Teams';
import { checkBackups } from '../Backups/checkBackups';
import { loadConfig } from '../Config/loadConfig';
import { CheckerQue } from './Que';

export async function startScheduler(): Promise<[void, Job]> {
  const configPath = process.env.CONFIG_PATH || 'config.yml';

  logger.log(LogMode.INFO, 'Starting Scheduler');

  const appConfig = await loadConfig(configPath);

  logger.log(LogMode.INFO, 'Loaded Config');

  return Promise.all([
    CheckerQue.process(1, async function (job) {
      logger.log(LogMode.INFO, 'Running Task');

      const checkedBackups = await checkBackups(job.data);

      await postCardMessageToTeams(checkedBackups, job.data);

      logger.log(LogMode.INFO, 'Posted to Teams');

      await job.moveToCompleted();
    }),
    CheckerQue.add(appConfig, {
      jobId: 'backups',
      repeat: {
        cron: appConfig.schedule || `*/1 * * * *`,
      },
    }),
  ]);
}
