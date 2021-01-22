/* eslint-disable @typescript-eslint/ban-types */
// src/Modules/Config/ConfigController.ts
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import Container, { Service, Token } from 'typedi';
import { GenericType, isObjectType } from '../../Utils/isTypes';
import { Config } from './Config';

export const ConfigToken = new Token<string>('config');

@Service()
export class ConfigController {
  /**
   * Ensure a object is an Config
   * @param config Config Object
   */
  public isConfig(config: Config | GenericType): config is Config {
    if (isObjectType<Config>(config, 'auth')) {
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

      Container.set(ConfigToken, config);

      return config;
    }

    throw new Error('Invalid Config.');
  }
}

export const configController = Container.get(ConfigController);
