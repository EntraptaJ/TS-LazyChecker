// src/Modules/ServerConfig/ServerBackupConfig.ts
export interface ServerBackupConfig {
  /**
   * Rapid Recovery Backup Id
   */
  rrId: string;

  /**
   * Backup Hourly Interval
   */
  backupHourInterval: number;
}
