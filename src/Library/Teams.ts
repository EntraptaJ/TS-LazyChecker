// src/Library/Teams.ts
import got from 'got';
import { CheckedMachine } from '../Modules/Checks/CheckedMachine';
import { ConfigYML } from '../Modules/Config/Config';
import { logger, LogMode } from './Logging';

/**
 * Post a status card in Teams detailing the VM last snapshot dates.
 * @param checkedMachines Array containing the checked machines object
 * @param configYML App Configuration
 *
 * @returns Promise resolving to a boolean indicating success
 */
export async function postCardMessageToTeams(
  checkedMachines: CheckedMachine[],
  configYML: ConfigYML,
): Promise<boolean> {
  if (typeof configYML.teamsWebHook === 'undefined') {
    return false;
  }

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

/**
 * Post a message to teams with red theme color. Although the Teams docs advise not to use status color in theme, I don't care. This works until I can
 * seperate Status and Error Messages
 *
 * @param title Title of the Critical Message
 * @param message Body of the critial message
 * @param configYML App configuration
 *
 * @returns Promise resolving to true if everything was sent successfully, otherwise it throws an error.
 */
export async function postCriticalMessageToTeamms(
  title: string,
  message: string,
  configYML: ConfigYML,
): Promise<boolean> {
  if (typeof configYML.teamsWebHook === 'undefined') {
    return false;
  }

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
    logger.log(
      LogMode.ERROR,
      `Error sending critical message. ${JSON.stringify(err)}`,
    );
    throw new Error('Error sending webhook');
  }
}
