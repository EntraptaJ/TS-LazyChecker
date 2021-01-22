// src/Modules/Firewals/FirewallResult.ts
interface FirewallSavedResult {
  result: 'saved';

  uuid?: string;
}

interface FirewallFailedResult {
  result: 'failed';

  validations: {
    [key: string]: string;
  };
}

export type FirewallResult = FirewallSavedResult | FirewallFailedResult;
