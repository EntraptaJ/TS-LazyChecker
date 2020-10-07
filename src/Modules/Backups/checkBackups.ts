// src/Modules/Backups/checkBackups.ts
import { differenceInCalendarDays } from 'date-fns';
import { postCriticalMessageToTeamms } from '../../Library/Teams';
import { CheckedMachine } from '../Checks/CheckedMachine';
import { ConfigYML } from '../Config/Config';
import { getMachines } from '../Machines/getMachines';

export async function checkBackups(
  config: ConfigYML,
): Promise<CheckedMachine[]> {
  const protectedMachines = await getMachines(config);

  const watchedIds = config.watchedMachines.map(({ id }) => id);

  const machines = protectedMachines.filter(({ Id }) =>
    watchedIds.includes(Id),
  );

  const currentDate = new Date();

  return machines.map((machine) => {
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

    if (daysSinceLastSnapshot >= watchedEntry.daysWithoutBackup) {
      postCriticalMessageToTeamms(
        `Backup Checker ${watchedEntry.name} backup error`,
        `@Harpreet ${watchedEntry.name} has gone ${watchedEntry.daysWithoutBackup} or more days without a backup`,
        config,
      );
    }

    return new CheckedMachine({
      machineName: watchedEntry.name,
      machineId: machine.Id,
      daysSinceLastSnapshot,
      machine,
    });
  });
}
