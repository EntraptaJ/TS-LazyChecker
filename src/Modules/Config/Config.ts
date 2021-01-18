// src/Modules/Configs/Config.ts
import { PathLike } from 'fs';
import { Token } from 'typedi';

export const ConfigToken = new Token<string>('config');

interface WatchedMachine {
  /**
   * Name of machine to use in alerts
   */
  name: string;

  id: string;

  /**
   * Days without backups to trigger an alert
   */
  daysWithoutBackup?: number;
}

interface Auth {
  username: string;

  password: string;
}

// interface TeamsConfig {
//   clientId: string;

//   clientSecret: string;

//   alertTeam: string;

//   alertChannel: string;
// }

export interface ConfigYML {
  /**
   * Rapid Recovery Uri
   */
  controllerUri: string;

  /**
   * Server Configuration File Path
   */
  serverConfigFilePath?: PathLike;

  /**
   * Security Zones Configuration File Path
   */
  zoneConfigFilePath?: PathLike;

  /**
   * Microsoft Teams Config
   */
  // teams: TeamsConfig;

  /**
   * Schedule
   * defaults to 30th minute every 12 hours
   */
  schedule?: string;

  /**
   * Rapid Recovery Authenication
   */
  auth: Auth;

  /**
   * Days since last backup to alert when equal or above
   * @default 1
   */
  defaultDaysWithoutBackup?: number;

  /**
   * Microsoft Teams WebHook to alert
   */
  teamsWebHook?: string;

  watchedMachines: WatchedMachine[];

  /**
   * Overwrite the existing task schedule
   */
  overwriteSchedule?: boolean;

  /**
   * Time to reverse start schedule
   */
  scheduleStartTime?: string;
}

export interface Config extends ConfigYML {
  /**
   * Days since last backup to alert when equal or above
   * @default 1
   */
  defaultDaysWithoutBackup: number;
}
