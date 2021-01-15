// src/Modules/Schedule/Scheduler.ts
import { Job } from 'bull';
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
export async function startScheduler(): Promise<[void, Job]> {
  const configPath = process.env.CONFIG_PATH || 'config.yml';

  logger.log(LogMode.INFO, 'Starting Scheduler');

  const appConfig = await configController.loadConfig(configPath);

  const rrController = Container.get(RapidRecoveryController);

  logger.log(LogMode.INFO, 'Loaded Config');

  console.log(await CheckerQue.getWorkers());

  await CheckerQue.clean(0);

  return Promise.all([
    CheckerQue.process(1, async function (job) {
      logger.log(LogMode.INFO, 'Running Task');
      console.log('HelloWorld');

      const checkedBackups = await rrController.checkBackups();

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
