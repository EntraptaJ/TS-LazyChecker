// src/Modules/Firewalls/FirewallConfig.ts
interface FirewallConfigYAML {
  hostname: string;

  auth: {
    secret: string;

    key: string;
  };
}

export interface FirewallConfigFileYAML {
  firewalls: FirewallConfigYAML[];
}
