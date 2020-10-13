// src/Modules/Machines/checkMachineResponse.ts
import { Readable } from 'stream';
import { Machine } from './MachineModel';

interface RESTResponse {
  rows: Machine[];
}

/**
 * Validate that an object is a valid RapidRecovery API Response.
 *
 * @param response Response from RapidRecovery API
 *
 * @returns True if the response is a valid RapidRecovery Response object, false otherwise.
 */
export function checkMachineResponse(
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
