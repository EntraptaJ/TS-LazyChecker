// src/Modules/Configs/Config.ts

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

export interface ConfigYML {
  /**
   * Rapid Recovery Uri
   */
  controllerUri: string;

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
  teamsWebHook: string;

  watchedMachines: WatchedMachine[];
}

export interface Config extends ConfigYML {
  /**
   * Days since last backup to alert when equal or above
   * @default 1
   */
  defaultDaysWithoutBackup: number;
}
