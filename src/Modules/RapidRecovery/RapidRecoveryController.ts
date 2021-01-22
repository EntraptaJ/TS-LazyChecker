/* eslint-disable no-useless-constructor */
// src/Modules/RapidRecovery/RapidRecoveryController.ts
import { request } from '@elastic.io/ntlm-client';
import {
  AdaptiveCard,
  Version,
  Container as CardContainer,
  FactSet,
  Fact,
} from 'adaptivecards';
import { differenceInHours } from 'date-fns';
import { Readable } from 'stream';
import { Inject, Service } from 'typedi';
import { logger, LogMode } from '../../Library/Logging';
import { TeamsController } from '../../Library/Teams/TeamsController';
import { CheckedMachine } from '../Checks/CheckedMachine';
import type { Config } from '../Config/Config';
import { ConfigToken } from '../Config/ConfigController';
import { ProtectedMachine } from './MachineModel';
import {
  MachineRequestBody,
  MachineRequestHeaders,
} from './RapidRecoveryConsts';

interface RESTResponse {
  rows: ProtectedMachine[];
}

@Service()
export class RapidRecoveryController {
  @Inject(ConfigToken)
  public config: Config;

  public constructor(private teamsController: TeamsController) {}

  /**
   * Validate that an object is a valid RapidRecovery API Response.
   *
   * @param response Response from RapidRecovery API
   *
   * @returns True if the response is a valid RapidRecovery Response object, false otherwise.
   */
  public checkMachineResponse(
    response: RESTResponse | string | Buffer | Buffer[] | string[] | Readable,
  ): response is RESTResponse {
    if (typeof response === 'string' || Array.isArray(response)) {
      return false;
    }

    if ('rows' in response) {
      if (typeof response?.rows[0]?.AgentStatus === 'undefined') {
        return false;
      }

      return true;
    }

    return false;
  }

  public createTeamsContainer(checkedMachine: CheckedMachine): CardContainer {
    const container = new CardContainer();

    const cardHeader = this.teamsController.createHeaderContainer(
      `${checkedMachine.machineName} Checks`,
    );
    container.addItem(cardHeader);

    const lastBackupFact = new Fact(
      'Last Snapshot',
      new Date(checkedMachine.machine.LastSnapshot).toLocaleString('en-US'),
    );
    const daysSinceLastSnapshotFact = new Fact(
      'Days since Snapshot',
      checkedMachine.daysSinceLastSnapshot.toString(),
    );

    const factSet = new FactSet();
    factSet.facts.push(lastBackupFact, daysSinceLastSnapshotFact);
    container.addItem(factSet);

    return container;
  }

  public generateTeamsCard(checkedMachines: CheckedMachine[]): AdaptiveCard {
    const card = new AdaptiveCard();
    card.version = new Version(1, 2);

    const coreTitleColumn = this.teamsController.createHeaderContainer(
      'TS-LazyChecker Checks',
    );
    card.addItem(coreTitleColumn);

    const containers = checkedMachines.map((checkedMachine) =>
      this.createTeamsContainer(checkedMachine),
    );

    containers.map((container) => card.addItem(container));

    return card;
  }

  public async postTeamsDigest(
    checkedMachines: CheckedMachine[],
  ): Promise<boolean> {
    return this.teamsController.postAdaptiveCardMessage(
      this.generateTeamsCard(checkedMachines),
    );
  }

  /**
   * Get Machines from RapidRecovery API
   *
   * @param config App Configuration
   *
   * @returns Promise resolving to array of Protected machines
   */
  public async getMachines(): Promise<ProtectedMachine[]> {
    logger.log(LogMode.DEBUG, 'getMachines()');

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const { body } = await request({
      uri: `${this.config.controllerUri}/apprecovery/admin/Core/ProtectedMachinesGridCallback`,
      method: 'POST',
      request: {
        json: true,
        headers: MachineRequestHeaders,
        body: MachineRequestBody,
      },
      ...this.config.auth,
    });

    logger.log(LogMode.DEBUG, 'getMachines() has obtained protected machines');

    if (this.checkMachineResponse(body)) {
      return body.rows;
    }

    throw new Error('Invalid response from RR API');
  }

  /**
   * Get and check all Backups
   */
  public async checkBackups(): Promise<CheckedMachine[]> {
    logger.log(LogMode.INFO, 'Running checkBackups');

    const protectedMachines = await this.getMachines();

    logger.log(LogMode.DEBUG, 'checkBackups() protectedMachines: ');

    /**
     * Map out all watched machine Ids into an string array
     */
    const watchedIds = this.config.watchedMachines.map(({ id }) => id);

    /**
     * Filter out all machine which Ids are included in our watched machines Ids
     */
    const machines = protectedMachines.filter(({ Id }) =>
      watchedIds.includes(Id),
    );

    const currentDate = new Date();

    return Promise.all(
      machines.map(async (machine) => {
        const watchedEntry = this.config.watchedMachines.find(
          ({ id }) => id === machine.Id,
        );

        if (!watchedEntry) {
          throw new Error('Checked machine not found in Watched Machines');
        }

        const lastBackupDate = new Date(machine.LastSnapshot);

        const housrSinceLastSnapshot = differenceInHours(
          currentDate,
          lastBackupDate,
        );

        const daysSinceLastSnapshot = housrSinceLastSnapshot / 24;

        const roundedDaysSinceLastSnapshot =
          Math.round(daysSinceLastSnapshot * 100) / 100;

        const maxDaysWithoutBackup =
          watchedEntry?.daysWithoutBackup ||
          this.config.defaultDaysWithoutBackup;

        if (roundedDaysSinceLastSnapshot >= maxDaysWithoutBackup) {
          const warnMessage = `${watchedEntry.name} has gone ${maxDaysWithoutBackup} or more days without a backup`;

          logger.log(LogMode.WARN, warnMessage);

          await this.teamsController.postCriticalMessageToTeams({
            title: `Backup Checker ${watchedEntry.name} backup error`,
            text: warnMessage,
          });
        }

        return new CheckedMachine({
          machineName: watchedEntry.name,
          machineId: machine.Id,
          daysSinceLastSnapshot: roundedDaysSinceLastSnapshot,
          machine,
        });
      }),
    );
  }
}
