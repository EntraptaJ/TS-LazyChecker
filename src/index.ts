// src/index.ts
import { logger, LogMode } from './Library/Logging';
import './setup';

logger.log(LogMode.INFO, 'Starting TS-LazyChecker');

const configPath = process.env.CONFIG_PATH || 'config.yml';

const { configController } = await import('./Modules/Config/ConfigController');

await configController.loadConfig(configPath);

const [{ startScheduler }] = await Promise.all([
  import('./Modules/Schedule/Scheduler'),
]);

await startScheduler();

logger.log(LogMode.INFO, 'Started TS-LazyChecker');
