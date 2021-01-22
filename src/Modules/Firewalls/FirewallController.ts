// src/Modules/Firewalls/FirewallController.ts
import {
  AdaptiveCard,
  Container as CardContainer,
  Fact,
  FactSet,
  Spacing,
  TextBlock,
  TextWeight,
  Version,
} from 'adaptivecards';
import type { CancelableRequest, Got, OptionsOfJSONResponseBody } from 'got';
import { logger, LogMode } from 'ts-lazychecker/Library/Logging';
import { TeamsController } from 'ts-lazychecker/Library/Teams/TeamsController';
import { isObjectType } from 'ts-lazychecker/Utils/isTypes';
import { timeout } from 'ts-lazychecker/Utils/timeout';
import { Inject, Service } from 'typedi';
import { FirewallDiagnosticInterfaceNames } from './Diagnostics/Interface/FirewallDiagnosticInterfaceNames';
import { FirewallDiagnosticsInterfaceARP } from './Diagnostics/Interface/FirewallDiagnosticsInterfaceARP';
import { FirewallDiagnosticsInterfaceRoute } from './Diagnostics/Interface/FirewallDiagnosticsInterfaceRoute';
import { Firewall, FirewallToken, FWGotAPIToken } from './Firewall';
import { FirewallGateway } from './FirewallGateway';
import { FirewallResult } from './FirewallResult';
import { FirewallAlias } from './Firewalls/Alias/FirewallAlias';

// type Got = import('got').Got;

interface ItemsResponse<T> {
  items: T[];

  status: string | 'ok';
}

interface SearchResponse<T> {
  rowCount: number;

  current: number;

  rows: T[];

  total: number;
}

@Service()
export class FirewallController {
  @Inject(FirewallToken)
  public firewall: Firewall;

  @Inject(FWGotAPIToken)
  public fwGotAPI: Got;

  public constructor(private teamsController: TeamsController) {}

  private createRequest<T>(
    path: string,
    options?: OptionsOfJSONResponseBody,
  ): CancelableRequest<T> {
    return this.fwGotAPI<T>(
      path.startsWith('/') ? path.replace('/', '') : path,
      {
        ...options,
        resolveBodyOnly: true,
      },
    );
  }

  private isItemsResponse<T>(
    response: ItemsResponse<T> | Record<string, unknown>,
  ): response is ItemsResponse<T> {
    return isObjectType<ItemsResponse<T>>(response, 'items');
  }

  private isSearchResponse<T>(
    response: SearchResponse<T> | Record<string, unknown>,
  ): response is SearchResponse<T> {
    return isObjectType<SearchResponse<T>>(response, 'rows');
  }

  /*   private isArrayResponse<T>(response: T[]): response is T[] {
    if (Array.isArray(response)) {
      return true;
    }

    return false;
  }

  private async getArrayRequest<T>(path: string): Promise<T[]> {
    const apiResponse = await this.createRequest<ItemsResponse<T>>(path);

    if (this.isItemsResponse<T>(apiResponse)) {
      if (apiResponse.status !== 'ok') {
        logger.log(
          LogMode.WARN,
          `FirewallController.getItemsRequest() apiResponse.status !== 'OK'`,
        );

        throw new Error('Invalid API Response');
      }

      return apiResponse.items;
    }

    throw new Error('Invalid response and/or request');
  } */

  private async getItemsRequest<T>(path: string): Promise<T[]> {
    const apiResponse = await this.createRequest<ItemsResponse<T>>(path);

    if (this.isItemsResponse<T>(apiResponse)) {
      if (apiResponse.status !== 'ok') {
        logger.log(
          LogMode.WARN,
          `FirewallController.getItemsRequest() apiResponse.status !== 'OK'`,
        );

        throw new Error('Invalid API Response');
      }

      return apiResponse.items;
    }

    throw new Error('Invalid response and/or request');
  }

  private async getSearchRequest<T>(path: string): Promise<T[]> {
    const apiResponse = await this.createRequest<SearchResponse<T>>(path);

    if (this.isSearchResponse<T>(apiResponse)) {
      return apiResponse.rows;
    }

    throw new Error('Invalid response and/or request');
  }

  public async getFirewallAliases(): Promise<FirewallAlias[]> {
    return this.getSearchRequest<FirewallAlias>(
      '/api/firewall/alias/searchItem',
    );
  }

  public async createFirewallAlias(
    input: Omit<FirewallAlias, 'uuid'>,
  ): Promise<FirewallResult> {
    return this.createRequest(`/api/firewall/alias/addItem/`, {
      method: 'POST',
      json: {
        alias: input,
      },
    });
  }

  public async updateFirewallAlias(
    uuid: string,
    input: Omit<FirewallAlias, 'uuid'>,
  ): Promise<FirewallResult> {
    return this.createRequest(`/api/firewall/alias/setItem/${uuid}`, {
      method: 'POST',
      json: {
        alias: input,
      },
    });
  }

  public async getGateways(): Promise<FirewallGateway[]> {
    return this.getItemsRequest<FirewallGateway>('/api/routes/gateway/status');
  }

  public getDiagnosticsInterfaceRoutes(): Promise<
    FirewallDiagnosticsInterfaceRoute[]
  > {
    return this.createRequest<FirewallDiagnosticsInterfaceRoute[]>(
      '/api/diagnostics/interface/getRoutes',
      {
        method: 'GET',
      },
    );
  }

  public getDiagnosticsInterfaceARP(): Promise<
    FirewallDiagnosticsInterfaceARP[]
  > {
    return this.createRequest<FirewallDiagnosticsInterfaceARP[]>(
      '/api/diagnostics/interface/getArp',
      {
        method: 'GET',
      },
    );
  }

  public getDiagnosticsInterfaceNames(): Promise<FirewallDiagnosticInterfaceNames> {
    return this.createRequest<FirewallDiagnosticInterfaceNames>(
      '/api/diagnostics/interface/getInterfaceNames',
      {
        method: 'GET',
      },
    );
  }

  public async createGatewaysContainer(): Promise<CardContainer> {
    const gatewayContainer = new CardContainer();
    gatewayContainer.bleed = true;

    const gatewayHeader = this.teamsController.createHeaderContainer(
      'Gateways',
    );
    gatewayContainer.addItem(gatewayHeader);

    const gateways = await this.getGateways();

    gateways.map(({ name, delay, address, loss }, index) => {
      const gwContainer = new CardContainer();
      gwContainer.bleed = true;

      if (index !== 0) gwContainer.separator = true;

      const gwTitle = new TextBlock(`${name}`);
      gwTitle.weight = TextWeight.Bolder;
      gwContainer.addItem(gwTitle);

      const gwDelayFact = new Fact(`Delay`, delay);
      const addressFact = new Fact('Address', address);
      const lossFact = new Fact('Loss', loss);

      const gwFactSet = new FactSet();
      gwFactSet.facts.push(gwDelayFact, addressFact, lossFact);
      gwContainer.addItem(gwFactSet);

      return gatewayContainer.addItem(gwContainer);
    });

    return gatewayContainer;
  }

  public async createFirewallCard(): Promise<AdaptiveCard> {
    const card = new AdaptiveCard();
    card.version = new Version(1, 2);

    const coreHeader = this.teamsController.createHeaderContainer(
      'Firewall Information',
    );
    card.addItem(coreHeader);

    const coreDescription = new Fact('Description', 'Core Office Firewall');
    const coreURI = new Fact('URI', this.firewall.hostname);

    const coreFacts = new FactSet();
    coreFacts.spacing = Spacing.Large;
    coreFacts.facts.push(coreDescription, coreURI);

    const coreContainer = new CardContainer();
    coreContainer.addItem(coreFacts);
    card.addItem(coreContainer);

    const gatewayContainer = await this.createGatewaysContainer();
    card.addItem(gatewayContainer);

    return card;
  }

  public async postFirewallToTeams(): Promise<void> {
    const card = await this.createFirewallCard();

    const messageResult = await this.teamsController.postAdaptiveCardMessage(
      card,
    );
    if (messageResult === false) {
      throw new Error('Error while posting to teams');
    }

    logger.log(LogMode.DEBUG, 'postFirewallToTeams() test');
  }

  public async labRequest(): Promise<void> {
    /*     const response = await this.getSearchRequest<FirewallGateway>(
      '/api/firewall/alias/searchItem',
    ); */

    const card = new AdaptiveCard();
    card.version = new Version(1, 2);

    const coreTitleColumn = this.teamsController.createHeaderContainer(
      'Apollo Service',
    );
    card.addItem(coreTitleColumn);

    const coreDescription = new Fact('Description', 'Service for ABC');
    const coreURI = new Fact('URI', 'https://test.example.ca');
    const backupInterval = new Fact('Backup Interval', '4 Hours');

    const coreFacts = new FactSet();
    coreFacts.spacing = Spacing.Large;
    coreFacts.facts.push(coreDescription, coreURI, backupInterval);

    const coreContainer = new CardContainer();
    coreContainer.addItem(coreFacts);
    card.addItem(coreContainer);

    const backupsTitleColumn = this.teamsController.createHeaderContainer(
      'Backups',
    );
    card.addItem(backupsTitleColumn);

    const lastSnapshotFact = new Fact('Last Snapshot', 'Yesterday at 1PM');

    const backupFacts = new FactSet();
    backupFacts.facts.push(lastSnapshotFact);
    card.addItem(backupFacts);

    const vmsTitleColumn = this.teamsController.createHeaderContainer('VM');
    card.addItem(vmsTitleColumn);

    const cpuUsageFact = new Fact('VM CPU Usage:', '80%');

    const vmFacts = new FactSet();
    vmFacts.facts.push(cpuUsageFact);

    card.addItem(vmFacts);

    const test = await this.teamsController.postAdaptiveCardMessage(card);

    logger.log(LogMode.DEBUG, 'labRequest() test', test);
  }

  public async getIPAddress(): Promise<string> {
    logger.log(LogMode.DEBUG, `FirewallController.getIPAddress()`);

    logger.log(
      LogMode.DEBUG,
      `FirewallController.getIPAddress() firewall: `,
      this.firewall,
    );

    await timeout(100);

    return 'helloWorld';
  }
}
