// src/bin/listMachines.ts
import '../setup';
import Container from 'typedi';
import { configController } from '../Modules/Config/ConfigController';
import { RapidRecoveryController } from '../Modules/RapidRecovery/RapidRecoveryController';

const configPath = process.env.CONFIG_PATH || 'config.yml';

await configController.loadConfig(configPath);

const rrController = Container.get(RapidRecoveryController);

const machines = await rrController.getMachines();

for (const machine of machines) {
  console.log(`Machine ${machine.DisplayName} ID: ${machine.Id}`);
}
