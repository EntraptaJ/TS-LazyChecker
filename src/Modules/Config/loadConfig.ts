// src/Modules/Config/loadConfig.ts
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { ConfigYML } from './Config';
import { checkConfig } from './validateConfig';

export async function loadConfig(configPath: string): Promise<ConfigYML> {
  /**
   * Read the config file path from disk
   */
  const configFile = await readFile(configPath);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const yml = load(configFile.toString());

  // Ensure config has all required keys
  if (checkConfig(yml)) {
    return yml;
  }

  throw new Error('Invalid Config.');
}
