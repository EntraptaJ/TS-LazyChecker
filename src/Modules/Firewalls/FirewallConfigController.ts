// src/Modules/Firewalls/FirewallConfigController.ts
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { logger, LogMode } from 'ts-lazychecker/Library/Logging';
import Container, { Inject, Service } from 'typedi';
import type { Config } from '../Config/Config';
import { Firewall, FirewallToken } from './Firewall';
import { FirewallConfigFileYAML } from './FirewallConfig';
import { FirewallController } from './FirewallController';

@Service()
export class FirewallConfigController {
  @Inject('config')
  public config: Config;

  public firewalls: Firewall[];

  /**
   * Ensure a object is an Config
   * @param config Config Object
   */
  public isConfig(
    config:
      | FirewallConfigFileYAML
      | string
      | number
      | undefined
      | null
      // eslint-disable-next-line @typescript-eslint/ban-types
      | object,
  ): config is FirewallConfigFileYAML {
    if (
      typeof config === 'string' ||
      Array.isArray(config) ||
      typeof config === 'number' ||
      typeof config === 'undefined' ||
      config === null
    ) {
      return false;
    }

    console.log('Fucker?', config.firewalls);

    if ('firewalls' in config) {
      return true;
    }

    return false;
  }

  public async loadFile(): Promise<void> {
    const firewallsConfigFilePath = 'firewalls.yml';

    const firewallsFile = await readFile(firewallsConfigFilePath);

    const firewallsConfigFile = load(firewallsFile.toString());

    console.log(firewallsConfigFile);

    if (this.isConfig(firewallsConfigFile)) {
      logger.log(
        LogMode.INFO,
        'Loaded Security Zone Configuration File',
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
