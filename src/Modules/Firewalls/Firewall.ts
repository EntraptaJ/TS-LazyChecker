// src/Modules/Firewalls/Firewall.ts
import hyperid from 'hyperid';
import got from 'got';
import Container, { ContainerInstance, Token } from 'typedi';

interface FirewallAuth {
  key: string;

  secret: string;
}

export const FirewallToken = new Token<symbol>('firewall');

export const FWGotAPIToken = new Token<string>('fw-got');

export class Firewall {
  public id: string = hyperid().uuid;

  public hostname: string;

  public auth: FirewallAuth;

  public container: ContainerInstance = Container.of(this.id);

  public constructor(options: Partial<Omit<Firewall, 'id'>>) {
    Object.assign(this, options);

    const authBuffer = Buffer.from(`${this.auth.key}:${this.auth.secret}`);

    const gotInstance = got.extend({
      prefixUrl: `https://${this.hostname}`,
      headers: {
        Authorization: `Basic ${authBuffer.toString('base64')}`,
      },
      responseType: 'json',
      resolveBodyOnly: true,
    });

    this.container.set(FWGotAPIToken, gotInstance);
  }
}
