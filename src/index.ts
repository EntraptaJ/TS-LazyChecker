// src/index.ts
import { postCardMessageToTeams } from './Library/Teams';
import { checkBackups } from './Modules/Backups/checkBackups';
import { loadConfig } from './Modules/Config/loadConfig';

console.log(`Starting TS-Core`);

const configPath = process.env.CONFIG_PATH || 'config.yml';

const appConfig = await loadConfig(configPath);

const checkedBackups = await checkBackups(appConfig);

await postCardMessageToTeams(checkedBackups, appConfig);
