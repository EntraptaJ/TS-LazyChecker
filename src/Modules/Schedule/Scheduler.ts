// src/Modules/Schedule/Scheduler.ts
import { postCardMessageToTeams } from '../../Library/Teams';
import { checkBackups } from '../Backups/checkBackups';
import { loadConfig } from '../Config/loadConfig';
import { CheckerQue } from './Que';

export async function startScheduler(): Promise<void> {
  const configPath = process.env.CONFIG_PATH || 'config.yml';

  console.log(`Starting Scheduler`);

  const appConfig = await loadConfig(configPath);

  console.log('Created entry');

  await Promise.all([
    CheckerQue.process(1, async function (job) {
      console.log('Running task');
      const checkedBackups = await checkBackups(job.data);

      await postCardMessageToTeams(checkedBackups, job.data);

      console.log('Posted to teams');

      await job.finished();
    }),
    CheckerQue.add(appConfig, {
      jobId: 'backups',
      repeat: {
        cron: `30 */12 * * *`,
      },
    }),
  ]);

  console.log('Proceses');
}
