// src/Modules/Networks/NetworkController.ts
import { logger, LogMode } from 'ts-lazychecker/Library/Logging';
import { Inject, Service } from 'typedi';
import type { Config } from '../Config/Config';

@Service()
export class NetworkController {
  @Inject('config')
  public config: Config;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async helloWorld(): Promise<void> {
    logger.log(LogMode.INFO, 'NetworkController helloWorld()');
  }
}
