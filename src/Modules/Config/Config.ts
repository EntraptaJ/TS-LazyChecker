// src/Modules/Configs/Config.ts

interface WatchedMachine {
  name: string;

  id: string;

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

  auth: Auth;

  /**
   * Days since last backup to alert when equal or above
   * @default 1
   */
  defaultDaysWithoutBackup?: number;

  /**
   *
   */
  teamsWebHook: string;

  watchedMachines: WatchedMachine[];
}
