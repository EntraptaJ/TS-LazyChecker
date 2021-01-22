/* eslint-disable camelcase */
// src/Modules/Firewalls/FirewallDiagnosticsInterfaceRoute.ts
export interface FirewallDiagnosticsInterfaceRoute {
  proto: string;

  destination: string;

  gateway: string;

  flags: string;

  use: string;

  mtu: string;

  netif: string;

  expire: string;

  intf_description: string;
}
