/* eslint-disable @typescript-eslint/ban-types */
// src/Modules/Config/ConfigController.ts
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import Container, { Service } from 'typedi';
import { Config, ConfigYML } from './Config';

@Service()
export class ConfigController {
  /**
   * Ensure a object is an Config
   * @param config Config Object
   */
  public isConfig(
    config: ConfigYML | string | number | undefined | null | object,
  ): config is ConfigYML {
    if (
      typeof config === 'string' ||
      Array.isArray(config) ||
      typeof config === 'number' ||
      typeof config === 'undefined' ||
      config === null
    ) {
      return false;
    }

    if ('auth' in config) {
      if (!config.auth.password || !config.auth.password) {
        return false;
      }

      if (!config.controllerUri) {
        return false;
      }

      return true;
    }

    return false;
  }

  public async loadConfig(configPath: string): Promise<Config> {
    /**
     * Read the config file path from disk
     */
    const configFile = await readFile(configPath);

    const yml = load(configFile.toString());

    // Ensure config has all required keys
    if (this.isConfig(yml)) {
      const config = {
        defaultDaysWithoutBackup: 1,
        ...yml,
      };

      Container.set('config', config);

      return config;
    }

    throw new Error('Invalid Config.');
  }
}

export const configController = Container.get(ConfigController);
