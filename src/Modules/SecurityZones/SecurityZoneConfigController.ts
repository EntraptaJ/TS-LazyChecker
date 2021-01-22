// src/Modules/SecurityZones/SecurityZoneConfigController.ts
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { logger, LogMode } from '../../Library/Logging';
import { isObjectType } from '../../Utils/isTypes';
import { Inject, Service } from 'typedi';
import { ConfigToken } from '../Config/ConfigController';
import type { Config } from '../Config/Config';
import { SecurityZone } from './SecurityZone';
import { Zones as SecurityZoneConfig } from './SecurityZoneConfig';

@Service()
export class SecurityZoneConfigController {
  @Inject(ConfigToken)
  public config: Config;

  public async loadZoneFile(): Promise<void> {
    const securityZoneFilePath = this.config.zoneConfigFilePath || 'config.yml';

    const securityZoneFile = await readFile(securityZoneFilePath);

    const securityZoneConfig = load(securityZoneFile.toString());

    if (isObjectType<SecurityZoneConfig>(securityZoneConfig, 'zones')) {
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
