// src/Modules/SecurityZones/SecurityZoneConfig.ts
export interface SecurityZoneConfig {
  name: string;

  id: number;
}

export interface SecurityZoneConfigYAML {
  zones: SecurityZoneConfig[];
}
