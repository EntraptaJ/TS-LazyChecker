// src/Modules/Servers/ServerConfigController.ts
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { logger, LogMode } from 'ts-lazychecker/Library/Logging';
import { Inject, Service } from 'typedi';
import { Config } from '../Config/Config';
import { ServersYAML } from './ServerConfig';

@Service()
export class ServerConfigController {
  @Inject('config')
  public config: Config;

  /**
   * Ensure a object is an Config
   * @param config Config Object
   */
  public isServerConfig(
    // eslint-disable-next-line @typescript-eslint/ban-types
    config: ServersYAML | string | number | undefined | null | object,
  ): config is ServersYAML {
    if (
      typeof config === 'string' ||
      Array.isArray(config) ||
      typeof config === 'number' ||
      typeof config === 'undefined' ||
      config === null
    ) {
      return false;
    }

    if ('servers' in config) {
      return true;
    }

    return false;
  }

  /**
   * Load and proces Server configuration file
   */
  public async loadServerConfig(): Promise<void> {
    logger.log(LogMode.DEBUG, 'loadServerConfig()');

    const serverConfigFilePath =
      this.config.serverConfigFilePath || 'servers.yaml';

    const serverConfigFile = await readFile(serverConfigFilePath);

    const yml = load(serverConfigFile.toString());

    // Ensure config has all required keys
    if (this.isServerConfig(yml)) {
      logger.log(LogMode.DEBUG, `loadServerConfig() yml: `, yml);
    }

    throw new Error('Invalid Config.');
  }
}
