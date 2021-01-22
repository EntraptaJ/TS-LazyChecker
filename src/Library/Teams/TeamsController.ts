// src/Library/TeamsController.ts
import {
  AdaptiveCard,
  Column,
  ColumnSet,
  Container,
  ContainerStyle,
  TextBlock,
  TextSize,
  TextWeight,
} from 'adaptivecards';
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

  public createHeaderContainer(title: string): Container {
    const titleText = new TextBlock(title);
    titleText.size = TextSize.Large;
    titleText.weight = TextWeight.Bolder;
    titleText.wrap = true;

    const titleColumn = new Column('stretch');
    titleColumn.width = 'stretch';
    titleColumn.addItem(titleText);

    const columnSet = new ColumnSet();
    columnSet.addColumn(titleColumn);

    const container = new Container();
    container.style = ContainerStyle.Emphasis;
    container.bleed = true;
    container.addItem(columnSet);

    return container;
  }

  public async postAdaptiveCardMessage(
    adaptiveCard: AdaptiveCard | AdaptiveCard[],
  ): Promise<boolean> {
    if (!this.config.teamsWebHook) {
      logger.log(LogMode.WARN, `Teams post requested, WebHook not configured`);

      return false;
    }

    const attachments = Array.isArray(adaptiveCard)
      ? adaptiveCard.map((card) => ({
          contentType: 'application/vnd.microsoft.card.adaptive',
          contentUrl: null,
          content: card.toJSON(),
        }))
      : [
          {
            contentType: 'application/vnd.microsoft.card.adaptive',
            contentUrl: null,
            content: adaptiveCard.toJSON(),
          },
        ];

    try {
      await got.post(this.config.teamsWebHook, {
        json: {
          type: 'message',
          attachments,
        },
      });
      return true;
    } catch (err) {
      console.log(err);
      throw new Error('Error sending webhook');
    }
  }

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
