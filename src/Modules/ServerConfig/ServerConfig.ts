// src/Modules/ServerConfig/ServerConfig.ts
import { ServerBackupConfig } from './ServerBackupConfig';
import { ServerNetworkConfig } from './ServerNetworkConfig';

export interface ServerConfig {
  /**
   * Friendly name for server
   */
  name: string;

  /**
   * RapidRecovery Machine ID
   */
  rrId: string;

  /**
   * Network
   */
  network: ServerNetworkConfig;

  /**
   * Server Backups
   */
  backups: ServerBackupConfig;
}

export interface ServersYAML {
  /**
   * Configured Servers/Machines
   */
  servers: ServerConfig[];
}
