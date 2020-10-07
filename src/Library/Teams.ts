// src/Library/Teams.ts
import got from 'got';
import { CheckedMachine } from '../Modules/Checks/CheckedMachine';
import { ConfigYML } from '../Modules/Config/Config';

export async function postCardMessageToTeams(
  checkedMachines: CheckedMachine[],
  configYML: ConfigYML,
): Promise<boolean> {
  const card = {
    '@context': 'https://schema.org/extensions',
    '@type': 'MessageCard',
    themeColor: '0072C6',
    title: 'Chore Checker',
    text: 'Monitored Machines have been checked.',
    sections: checkedMachines.map((checkedMachine) => ({
      activityTitle: `${checkedMachine.machineName} Backups`,
      text: `Backup dates have been checked`,
      facts: [
        {
          name: 'Last Backup:',
          value: new Date(checkedMachine.machine.LastSnapshot).toLocaleString(
            'en-US',
          ),
        },
        {
          name: 'Days since Snapshot:',
          value: checkedMachine.daysSinceLastSnapshot,
        },
      ],
    })),
  };

  try {
    await got.post(configYML.teamsWebHook, {
      json: card,
    });
    return true;
  } catch (err) {
    console.log(err);
    throw new Error('Error sending webhook');
  }
}

export async function postCriticalMessageToTeamms(
  title: string,
  message: string,
  configYML: ConfigYML,
): Promise<boolean> {
  const card = {
    '@context': 'https://schema.org/extensions',
    '@type': 'MessageCard',
    themeColor: 'FF0000',
    title: title,
    text: message,
  };

  try {
    await got.post(configYML.teamsWebHook, {
      json: card,
    });
    return true;
  } catch (err) {
    console.log(err);
    throw new Error('Error sending webhook');
  }
}
