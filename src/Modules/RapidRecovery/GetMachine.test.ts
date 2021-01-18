// Tests/AddTest/add.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import Container from 'typedi';
import '../../setup';
import type { Config } from '../Config/Config';
import { ConfigToken } from '../Config/Config';
import { createMachineServer } from './fixtures/MachineServer';
import { RapidRecoveryController } from './RapidRecoveryController';

export class GetMachineTest extends TestSuite {
  public testName = 'GetMachine';

  public async test(): Promise<void> {
    const [{ recentMachines }] = await Promise.all([
      import('./fixtures/recentMachines'),
    ]);

    const { stopServer } = await createMachineServer({
      port: 5859,
      protectedMachines: recentMachines,
    });

    const config = {
      auth: {
        password: 'helloWorld',
        username: 'kristianfjones',
      },
      controllerUri: 'http://localhost:5859',
      watchedMachines: [
        {
          id: 'a2e223c9-3fc3-4575-8090-2538a66ba998',
          name: 'Testing1',
          daysWithoutBackup: 1,
        },
      ],
      defaultDaysWithoutBackup: 1,
    };

    Container.set<Config>(ConfigToken, config);

    const rrController = Container.get(RapidRecoveryController);

    const test = await rrController.checkBackups();

    console.log(test);

    console.log('Stopping machine');

    await stopServer();
  }
}
