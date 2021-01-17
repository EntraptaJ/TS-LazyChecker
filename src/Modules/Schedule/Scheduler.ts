// src/Modules/Schedule/Scheduler.ts
import { Job, Worker } from 'bullmq';
import Container from 'typedi';
import { logger, LogMode } from '../../Library/Logging';
import { postCardMessageToTeams } from '../../Library/Teams';
import { configController } from '../Config/ConfigController';
import { RapidRecoveryController } from '../RapidRecovery/RapidRecoveryController';
import { CheckerQue } from './Que';

/**
 * Start the TS-LazyChecker Job Scheduler
 * @returns Promise.all containing the process and added job of the scheduler
 */
export async function startScheduler(): Promise<Job> {
  const configPath = process.env.CONFIG_PATH || 'config.yml';

  logger.log(LogMode.INFO, 'Starting Scheduler');

  const appConfig = await configController.loadConfig(configPath);

  const rrController = Container.get(RapidRecoveryController);

  logger.log(LogMode.INFO, 'Loaded Config');

  const schedulerWorker = new Worker(
    'BackupChecker',
    async (job) => {
      logger.log(LogMode.INFO, 'Running Task');

      const checkedBackups = await rrController.checkBackups();

      await postCardMessageToTeams(checkedBackups, job.data);

      logger.log(LogMode.INFO, 'Posted to Teams');
    },
    {
      connection: {
        host: process.env.REDIS_HOST || 'Redis',
      },
      concurrency: 1,
    },
  );

  logger.log(LogMode.DEBUG, `scheduleWorker: `, schedulerWorker);

  if (appConfig.overwriteSchedule === true) {
    logger.log(LogMode.INFO, 'Cleaning existing tasks to reset schedule');
    await CheckerQue.clean(0, 100);
  }

  const job = await CheckerQue.add('BackupChecker', appConfig, {
    jobId: 'backups',
    repeat: {
      cron: appConfig.schedule || `*/5 * * * *`,
    },
  });

  return job;
}
