// src/Modules/SecurityZones/SecurityZoneConfigController.ts
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { logger, LogMode } from 'ts-lazychecker/Library/Logging';
import { Inject, Service } from 'typedi';
import { Config } from '../Config/Config';
import { SecurityZone } from './SecurityZone';
import { SecurityZoneConfigYAML } from './SecurityZoneConfig';

@Service()
export class SecurityZoneConfigController {
  @Inject('config')
  public config: Config;

  /**
   * Ensure a object is an Config
   * @param config Config Object
   */
  public isConfig(
    config:
      | SecurityZoneConfigYAML
      | string
      | number
      | undefined
      | null
      // eslint-disable-next-line @typescript-eslint/ban-types
      | object,
  ): config is SecurityZoneConfigYAML {
    if (
      typeof config === 'string' ||
      Array.isArray(config) ||
      typeof config === 'number' ||
      typeof config === 'undefined' ||
      config === null
    ) {
      return false;
    }

    if ('zones' in config) {
      return true;
    }

    return false;
  }

  public async loadZoneFile(): Promise<void> {
    const securityZoneFilePath = this.config.zoneConfigFilePath || 'config.yml';

    const securityZoneFile = await readFile(securityZoneFilePath);

    const securityZoneConfig = load(securityZoneFile.toString());

    if (this.isConfig(securityZoneConfig)) {
      logger.log(
        LogMode.INFO,
        'Loaded Security Zone Configuration File',
        securityZoneConfig,
      );

      const securityZones = securityZoneConfig.zones.map((zoneConfig) => {
        return new SecurityZone(zoneConfig);
      });

      logger.log(LogMode.INFO, 'Security Zones: ', securityZones);
    }

    throw new Error('Invlaid Zone configuration file');
  }
}
