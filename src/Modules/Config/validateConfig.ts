// src/Modules/Config/validateConfig.ts
import { ConfigYML } from './Config';

/**
 * Ensure a object is an Config
 * @param config Config Object
 */
export function checkConfig(config: ConfigYML): config is ConfigYML {
  if (!config.auth.password || !config.auth.password) {
    return false;
  }

  if (!config.controllerUri) {
    return false;
  }

  return true;
}
