// src/Modules/Config/ConfigController.test.ts
// Tests/AddTest/add.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { strictEqual } from 'assert';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import '../../setup';
import { configController } from './ConfigController';

const localPath = resolve(fileURLToPath(import.meta.url), '../');
const exampleConfig1Path = resolve(localPath, './Fixtures/ExampleConfig1.yaml');

export class ConfigControllerTest extends TestSuite {
  public testName = 'ConfigControler Tests';

  public async test(): Promise<void> {
    const config1 = await configController.loadConfig(exampleConfig1Path);

    strictEqual(
      config1.defaultDaysWithoutBackup,
      1,
      'config1.defaultDaysWithoutBackup = 1',
    );
    strictEqual(
      config1.controllerUri,
      'https://192.168.1.111:8006',
      `config1.controllerUri = https://192.168.1.111:8006`,
    );

    strictEqual(
      config1.auth.username,
      'administrator',
      `config1.auth.username = administrator`,
    );
  }
}
