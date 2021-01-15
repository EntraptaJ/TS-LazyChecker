// src/Modules/RapidRecovery/RapidRecoveryController.ts
import { request } from '@elastic.io/ntlm-client';
import { differenceInHours } from 'date-fns';
import { Readable } from 'stream';
import { Inject, Service } from 'typedi';
import { postCriticalMessageToTeams } from '../../Library/Teams';
import { CheckedMachine } from '../Checks/CheckedMachine';
import type { Config } from '../Config/Config';
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
  @Inject('config')
  public config: Config;

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

  /**
   * Get Machines from RapidRecovery API
   *
   * @param config App Configuration
   *
   * @returns Promise resolving to array of Protected machines
   */
  public async getMachines(): Promise<ProtectedMachine[]> {
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

    if (this.checkMachineResponse(body)) {
      return body.rows;
    }

    throw new Error('Invalid response from RR API');
  }

  /**
   * Get and check all Backups
   */
  public async checkBackups(): Promise<CheckedMachine[]> {
    const protectedMachines = await this.getMachines();

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
          console.log(
            `${watchedEntry.name} has gone ${maxDaysWithoutBackup} or more days without a backup`,
          );

          await postCriticalMessageToTeams(
            `Backup Checker ${watchedEntry.name} backup error`,
            `${watchedEntry.name} has gone ${maxDaysWithoutBackup} or more days without a backup`,
            this.config,
          );
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
