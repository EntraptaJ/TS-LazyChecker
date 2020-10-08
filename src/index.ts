// src/index.ts
import { postCardMessageToTeams } from 'ts-lazychecker/Library/Teams';
import { checkBackups } from 'ts-lazychecker/Modules/Backups/checkBackups';
import { loadConfig } from 'ts-lazychecker/Modules/Config/loadConfig';

console.log(`Starting TS-LazyChecker`);

const configPath = process.env.CONFIG_PATH || 'config.yml';

const appConfig = await loadConfig(configPath);

const checkedBackups = await checkBackups(appConfig);

await postCardMessageToTeams(checkedBackups, appConfig);
