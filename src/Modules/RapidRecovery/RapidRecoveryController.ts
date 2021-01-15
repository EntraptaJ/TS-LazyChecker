// src/Modules/RapidRecovery/RapidRecoveryController.ts
import { Readable } from 'stream';
import Container, { Service } from 'typedi';
import { ProtectedMachine } from './MachineModel';
import { request } from '@elastic.io/ntlm-client';
import { Config, ConfigYML } from '../Config/Config';
import {
  MachineRequestBody,
  MachineRequestHeaders,
} from './RapidRecoveryConsts';
import { CheckedMachine } from '../Checks/CheckedMachine';
import { differenceInHours } from 'date-fns';
import { postCriticalMessageToTeams } from '../../Library/Teams';

interface RESTResponse {
  rows: ProtectedMachine[];
}

@Service()
export class RapidRecoveryController {
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
  public async getMachines(config: ConfigYML): Promise<ProtectedMachine[]> {
    const { body } = await request({
      uri: `${config.controllerUri}/apprecovery/admin/Core/ProtectedMachinesGridCallback`,
      method: 'POST',
      request: {
        json: true,
        headers: MachineRequestHeaders,
        body: MachineRequestBody,
      },
      ...config.auth,
    });

    if (this.checkMachineResponse(body)) {
      return body.rows;
    }

    throw new Error('Invalid response from RR API');
  }

  /**
   * Get and check all Backups
   */
  public async checkBackups(config: Config): Promise<CheckedMachine[]> {
    const protectedMachines = await this.getMachines(config);

    /**
     * Map out all watched machine Ids into an string array
     */
    const watchedIds = config.watchedMachines.map(({ id }) => id);

    /**
     * Filter out all machine which Ids are included in our watched machines Ids
     */
    const machines = protectedMachines.filter(({ Id }) =>
      watchedIds.includes(Id),
    );

    const currentDate = new Date();

    return Promise.all(
      machines.map(async (machine) => {
        const watchedEntry = config.watchedMachines.find(
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
          watchedEntry?.daysWithoutBackup || config.defaultDaysWithoutBackup;

        if (roundedDaysSinceLastSnapshot >= maxDaysWithoutBackup) {
          console.log(
            `${watchedEntry.name} has gone ${maxDaysWithoutBackup} or more days without a backup`,
          );

          await postCriticalMessageToTeams(
            `Backup Checker ${watchedEntry.name} backup error`,
            `${watchedEntry.name} has gone ${maxDaysWithoutBackup} or more days without a backup`,
            config,
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

export const rrController = Container.get(RapidRecoveryController);
