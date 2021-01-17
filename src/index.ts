// src/index.ts
import { logger, LogMode } from './Library/Logging';
import { startScheduler } from './Modules/Schedule/Scheduler';
import './setup';

console.log(`Starting TS-LazyChecker`);

await startScheduler();

logger.log(LogMode.WARN, 'Started TS-LazyChecker');
