/* eslint-disable camelcase */
// src/Modules/Firewalls/Diagnostics/Interface/FirewallDiagnosticsInterfaceARP.ts
export interface FirewallDiagnosticsInterfaceARP {
  mac: string;

  ip: string;

  intf: string;

  expired: boolean;

  expires: number;

  permanent: boolean;

  type: string;

  manufacturer: string;

  hostname: string;

  intf_description: string;
}
