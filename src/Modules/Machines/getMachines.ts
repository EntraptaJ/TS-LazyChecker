// src/Modules/Machines/getMachines.ts
import { request } from '@elastic.io/ntlm-client';
import { ConfigYML } from '../Config/Config';
import { checkMachineResponse } from './checkMachineResponse';
import { Machine } from './MachineModel';
import { MachineRequestBody } from './MachineRequest';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line dot-notation
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

/**
 * Get Machines from RapidRecovery API
 *
 * @param config App Configuration
 *
 * @returns Promise resolving to array of Protected machines
 */
export async function getMachines(config: ConfigYML): Promise<Machine[]> {
  const { body } = await request({
    uri: `${config.controllerUri}/apprecovery/admin/Core/ProtectedMachinesGridCallback`,
    method: 'POST',
    request: {
      json: true,
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'CoreVersion=6.4.0.718',
      },
      body: MachineRequestBody,
    },
    ...config.auth,
  });

  if (checkMachineResponse(body)) {
    return body.rows;
  }

  throw new Error('Invalid response from RR API');
}
