// src/Modules/Config/loadConfig.ts
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { Config } from './Config';
import { checkConfig } from './validateConfig';

/**
 * Load and validate a YAML configuration file from disk
 * @param configPath Disk file path to the YAML Configuration file
 *
 * @returns Promise resolving to the JavaScript Object containing configuration
 */
export async function loadConfig(configPath: string): Promise<Config> {
  /**
   * Read the config file path from disk
   */
  const configFile = await readFile(configPath);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const yml = load(configFile.toString());

  // Ensure config has all required keys
  if (checkConfig(yml)) {
    return {
      defaultDaysWithoutBackup: 1,
      ...yml,
    };
  }

  throw new Error('Invalid Config.');
}
