// src/bin/listMachines.ts
import { loadConfig } from '../Modules/Config/loadConfig';
import { getMachines } from '../Modules/Machines/getMachines';

const configPath = process.env.CONFIG_PATH || 'config.yml';

const appConfig = await loadConfig(configPath);

const machines = await getMachines(appConfig);

for (const machine of machines) {
  console.log(`Machine ${machine.DisplayName} ID: ${machine.Id}`);
}
