// Tests/AddTest/add.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { strictEqual } from 'assert';
import Ajv from 'ajv';
import {
  protectedMachineRequestBodySchema,
  protectedMachineRequestHeaderSchema,
  protectedMachineResponseSchema,
} from './ProtectedMachineSchema';
import { MachineRequestBody, MachineRequestHeaders } from './MachineRequest';

export class MachineRequestSchemaTest extends TestSuite {
  public testName = 'MachineRequestSchema';

  public async test(): Promise<void> {
    const fixtureJSONFile = await readFile(
      resolve(fileURLToPath(import.meta.url), '../fixtures/sourceMock.json'),
    );

    const responseFixtureJSON = JSON.parse(fixtureJSONFile.toString());

    const ajv = new Ajv({ allErrors: true });
    const validateResponseSchema = ajv.compile(
      protectedMachineResponseSchema.valueOf(),
    );

    const validateRequestBody = ajv.compile(
      protectedMachineRequestBodySchema.valueOf(),
    );

    const validateRequestHeaders = ajv.compile(
      protectedMachineRequestHeaderSchema.valueOf(),
    );

    strictEqual(
      validateResponseSchema(responseFixtureJSON),
      true,
      'responseFixtureJSON validates true agaisnt schema',
    );

    strictEqual(
      validateRequestBody(MachineRequestBody),
      true,
      'Standard Request Body validates true agaisnt schema',
    );

    strictEqual(
      validateRequestHeaders(MachineRequestHeaders),
      true,
      'Standard Request Headers validates true agaisnt schema',
    );
  }
}
