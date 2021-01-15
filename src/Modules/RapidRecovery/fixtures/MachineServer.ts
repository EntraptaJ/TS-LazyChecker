/* eslint-disable @typescript-eslint/require-await */
import { ProtectedMachine } from '../MachineModel';
import {
  protectedMachineRequestBodySchema,
  protectedMachineRequestHeaderSchema,
} from '../ProtectedMachineSchema';
import { RRMachineResponse } from './RRMachine';

// src/Modules/Machines/Fixtures/MachineServer.ts
interface MachineServer {
  stopServer: () => Promise<boolean>;
}

interface MachineServerArgs {
  port: number;

  protectedMachines: ProtectedMachine[];
}

export async function createMachineServer({
  port,
  protectedMachines,
}: MachineServerArgs): Promise<MachineServer> {
  const [{ fastify }] = await Promise.all([import('fastify')]);

  const webServer = fastify();

  webServer.post(
    '/apprecovery/admin/Core/ProtectedMachinesGridCallback',
    {
      schema: {
        headers: protectedMachineRequestHeaderSchema,
        body: protectedMachineRequestBodySchema,
      },
    },
    async function (): Promise<RRMachineResponse> {
      return {
        total: 6,
        page: 1,
        records: protectedMachines.length,
        rows: protectedMachines,
      };
    },
  );

  await webServer.listen(port, '0.0.0.0');

  return {
    stopServer: async function (): Promise<boolean> {
      try {
        await webServer.close();

        return true;
      } catch (e) {
        return false;
      }
    },
  };
}
