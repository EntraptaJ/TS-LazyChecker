// src/Modules/Firewalls/FirewallConfigController.ts
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { logger, LogMode } from 'ts-lazychecker/Library/Logging';
import { isObjectType } from 'ts-lazychecker/Utils/isTypes';
import Container, { Inject, Service } from 'typedi';
import type { Config } from '../Config/Config';
import { ConfigToken } from '../Config/Config';
import { Firewall, FirewallToken } from './Firewall';
import { FirewallConfigFileYAML } from './FirewallConfig';
import { FirewallController } from './FirewallController';

@Service()
export class FirewallConfigController {
  @Inject(ConfigToken)
  public config: Config;

  public firewalls: Firewall[];

  /**
   * Load the configured firewalls configuration file from disk, parse the YAML and load into the class
   */
  public async loadFile(): Promise<void> {
    const firewallsConfigFilePath = 'firewalls.yml';

    const firewallsFile = await readFile(firewallsConfigFilePath);

    const firewallsConfigFile = load(firewallsFile.toString());

    if (
      isObjectType<FirewallConfigFileYAML>(firewallsConfigFile, 'firewalls')
    ) {
      logger.log(
        LogMode.INFO,
        'Loaded Firewalls Configuration File',
        firewallsConfigFile,
      );

      const firewalls = firewallsConfigFile.firewalls.map((firewall) => {
        return new Firewall(firewall);
      });

      this.firewalls = firewalls;

      return;
    }

    throw new Error('Invlaid Firewalls configuration file');
  }

  public getFirewall(hostname: string): FirewallController {
    const firewall = this.firewalls.find(
      (firewall) => firewall.hostname === hostname,
    );
    if (!firewall) {
      throw new Error('Invalid Firewall hostname');
    }

    const container = Container.of(firewall.id);

    container.set(FirewallToken, firewall);

    return container.get(FirewallController);
  }
}

export const firewallConfigController = Container.get(FirewallConfigController);
