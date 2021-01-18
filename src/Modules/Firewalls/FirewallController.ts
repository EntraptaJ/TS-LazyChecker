// src/Modules/Firewalls/FirewallController.ts
import type { CancelableRequest, Got, OptionsOfJSONResponseBody } from 'got';
import { logger, LogMode } from 'ts-lazychecker/Library/Logging';
import { timeout } from 'ts-lazychecker/Utils/timeout';
import { Inject, Service } from 'typedi';
import { FirewallDiagnosticInterfaceNames } from './Diagnostics/Interface/FirewallDiagnosticInterfaceNames';
import { FirewallDiagnosticsInterfaceARP } from './Diagnostics/Interface/FirewallDiagnosticsInterfaceARP';
import { FirewallDiagnosticsInterfaceRoute } from './Diagnostics/Interface/FirewallDiagnosticsInterfaceRoute';
import { Firewall, FirewallToken, FWGotAPIToken } from './Firewall';
import { FirewallGateway } from './FirewallGateway';
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
    if ('items' in response) {
      return true;
    }

    return false;
  }

  private isSearchResponse<T>(
    response: SearchResponse<T> | Record<string, unknown>,
  ): response is SearchResponse<T> {
    if ('rows' in response) {
      return true;
    }

    return false;
  }

  private isArrayResponse<T>(response: T[]): response is T[] {
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
  }

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
  ): Promise<boolean> {
    const apiResponse = await this.createRequest(
      `/api/firewall/alias/addItem/`,
      {
        method: 'POST',
        json: {
          alias: input,
        },
      },
    );

    logger.log(LogMode.DEBUG, `createFirewallAlias`, apiResponse);
  }

  public async updateFirewallAlias(
    uuid: string,
    input: Omit<FirewallAlias, 'uuid'>,
  ): Promise<boolean> {
    const apiResponse = await this.createRequest(
      `/api/firewall/alias/setItem/${uuid}`,
      {
        method: 'POST',
        json: {
          alias: input,
        },
      },
    );

    logger.log(LogMode.DEBUG, `updateFirewallAlias: `, apiResponse);
  }

  public async getGateways(): Promise<void> {
    const response = await this.getItemsRequest<FirewallGateway>(
      '/api/routes/gateway/status',
    );

    response.map((gateway) => {
      logger.log(
        LogMode.DEBUG,
        `FirewallController.getGateways() gateway: `,
        gateway,
      );
    });
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

  public async labRequest(): Promise<void> {
    const response = await this.getSearchRequest<FirewallGateway>(
      '/api/firewall/alias/searchItem',
    );

    logger.log(LogMode.DEBUG, 'labRequest', response);
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
