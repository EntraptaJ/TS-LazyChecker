// src/index.ts
import { logger, LogMode } from './Library/Logging';
import { startScheduler } from './Modules/Schedule/Scheduler';
import './setup';

logger.log(LogMode.INFO, 'Starting TS-LazyChecker');

await startScheduler();

logger.log(LogMode.INFO, 'Started TS-LazyChecker');
