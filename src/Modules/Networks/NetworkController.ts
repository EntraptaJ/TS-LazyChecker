// src/Modules/Networks/NetworkController.ts
import { logger, LogMode } from '../../Library/Logging';
import { Inject, Service } from 'typedi';
import { Config, ConfigToken } from '../Config/Config';

@Service()
export class NetworkController {
  @Inject(ConfigToken)
  public config: Config;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async helloWorld(): Promise<void> {
    logger.log(LogMode.INFO, 'NetworkController helloWorld()');
  }
}
