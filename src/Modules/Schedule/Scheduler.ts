// src/Modules/Schedule/Scheduler.ts
import { CheckerQue } from './Que';
import { checkBackups } from 'ts-lazychecker/Modules/Backups/checkBackups';
import { loadConfig } from 'ts-lazychecker/Modules/Config/loadConfig';
import { postCardMessageToTeams } from 'ts-lazychecker/Library/Teams';

export async function startScheduler(): Promise<void> {
  const configPath = process.env.CONFIG_PATH || 'config.yml';

  console.log(`Starting Scheduler`);

  const appConfig = await loadConfig(configPath);

  console.log('Created entry');

  await CheckerQue.process('BackupCheck', 1, async function (job) {
    console.log('Running task');
    const checkedBackups = await checkBackups(job.data);

    return postCardMessageToTeams(checkedBackups, job.data);
  });

  await CheckerQue.add('BackupCheck', appConfig, {
    repeat: {
      cron: `30 */12 * * *`,
    },
  });

  console.log('Proceses');
}
