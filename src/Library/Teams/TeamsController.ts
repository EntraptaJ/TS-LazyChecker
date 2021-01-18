// src/Library/TeamsController.ts
import got from 'got';
import { Inject, Service } from 'typedi';
import type { Config } from '../../Modules/Config/Config';
import { ConfigToken } from '../../Modules/Config/Config';
import { logger, LogMode } from '../Logging';
import { MessageCard } from './MessageCardInput';

interface CriticalMessageOptions {
  title: string;

  text: string;
}

@Service()
export class TeamsController {
  @Inject(ConfigToken)
  public config: Config;

  public async postMessageCard(messageCard: MessageCard): Promise<boolean> {
    if (!this.config.teamsWebHook) {
      logger.log(LogMode.WARN, `Teams post requested, WebHook not configured`);

      return false;
    }

    try {
      await got.post(this.config.teamsWebHook, {
        json: {
          '@context': 'https://schema.org/extensions',
          '@type': 'MessageCard',
          ...messageCard,
        },
      });
      return true;
    } catch (err) {
      console.log(err);
      throw new Error('Error sending webhook');
    }
  }

  public async postCriticalMessageToTeams(
    messageParams: CriticalMessageOptions,
  ): Promise<boolean> {
    return this.postMessageCard({
      themeColor: 'FF0000',
      ...messageParams,
    });
  }
}
