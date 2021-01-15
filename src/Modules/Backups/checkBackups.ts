// src/Modules/Backups/checkBackups.ts
import { differenceInHours } from 'date-fns';
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

  /**
   * Map out all watched machine Ids into an string array
   */
  const watchedIds = config.watchedMachines.map(({ id }) => id);

  /**
   * Filter out all machine which Ids are included in our watched machines Ids
   */
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

      const lastBackupDate = new Date(machine.LastSnapshot);

      const housrSinceLastSnapshot = differenceInHours(
        currentDate,
        lastBackupDate,
      );

      const daysSinceLastSnapshot = housrSinceLastSnapshot / 24;

      const roundedDaysSinceLastSnapshot =
        Math.round(daysSinceLastSnapshot * 100) / 100;

      const maxDaysWithoutBackup =
        watchedEntry?.daysWithoutBackup || config.defaultDaysWithoutBackup;

      if (roundedDaysSinceLastSnapshot >= maxDaysWithoutBackup) {
        console.log(
          `${watchedEntry.name} has gone ${maxDaysWithoutBackup} or more days without a backup`,
        );

        await postCriticalMessageToTeamms(
          `Backup Checker ${watchedEntry.name} backup error`,
          `${watchedEntry.name} has gone ${maxDaysWithoutBackup} or more days without a backup`,
          config,
        );
      }

      return new CheckedMachine({
        machineName: watchedEntry.name,
        machineId: machine.Id,
        daysSinceLastSnapshot: roundedDaysSinceLastSnapshot,
        machine,
      });
    }),
  );
}
