// src/Modules/Backups/checkBackups.ts
import { differenceInCalendarDays } from 'date-fns';
import { postCriticalMessageToTeamms } from '../../Library/Teams';
import { CheckedMachine } from '../Checks/CheckedMachine';
import { Config } from '../Config/Config';
import { getMachines } from '../Machines/getMachines';

/**
 * Check all backups to ensure they haven't gone longer than max days without
 * @param config App Config
 */
export async function checkBackups(config: Config): Promise<CheckedMachine[]> {
  const protectedMachines = await getMachines(config);

  const watchedIds = config.watchedMachines.map(({ id }) => id);

  const machines = protectedMachines.filter(({ Id }) =>
    watchedIds.includes(Id),
  );

  const currentDate = new Date();

  return Promise.all(
    machines.map(async (machine) => {
      const watchedEntry = config.watchedMachines.find(
        ({ id }) => id === machine.Id,
      );

      if (!watchedEntry) {
        throw new Error('Checked machine not found in Watched Machines');
      }

      const lastBackup = new Date(machine.LastSnapshot);

      const daysSinceLastSnapshot = differenceInCalendarDays(
        currentDate,
        lastBackup,
      );

      const maxDaysWithoutBackup =
        watchedEntry?.daysWithoutBackup || config.defaultDaysWithoutBackup;

      if (daysSinceLastSnapshot >= maxDaysWithoutBackup) {
        await postCriticalMessageToTeamms(
          `Backup Checker ${watchedEntry.name} backup error`,
          `${watchedEntry.name} has gone ${maxDaysWithoutBackup} or more days without a backup`,
          config,
        );
      }

      return new CheckedMachine({
        machineName: watchedEntry.name,
        machineId: machine.Id,
        daysSinceLastSnapshot,
        machine,
      });
    }),
  );
}
