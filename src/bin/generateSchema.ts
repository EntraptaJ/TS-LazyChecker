/* eslint-disable @typescript-eslint/explicit-function-return-type */
// src/bin/generateSchema.ts
import { ObjectSchema } from 'fluent-json-schema';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const schemaJSONPath = resolve(
  fileURLToPath(import.meta.url),
  '../../../schemas',
);

const schemaName = process.argv[2];
if (!schemaName) {
  throw new Error('Schema name required.');
}

interface SchemaModule {
  [key: string]: ObjectSchema;
}

type SchemaFile = {
  importModule: () => Promise<SchemaModule>;
  schemaName: string;
};

const schemas: SchemaFile[] = [
  {
    importModule: () => import('../Modules/Config/ConfigSchema'),
    schemaName: 'Config',
  },
  {
    importModule: () =>
      import('../Modules/SecurityZones/SecurityZoneConfigSchema'),
    schemaName: 'Zones',
  },
];

const selectedSchema = schemas.find(
  (schema) => schema.schemaName === schemaName,
);
if (!selectedSchema) {
  throw new Error('Invalid schema name. Schema not found');
}

for (const [, exportedSchema] of Object.entries(
  await selectedSchema.importModule(),
)) {
  const schemaJSON = JSON.stringify(exportedSchema.valueOf());
  const schemaFilePath = resolve(schemaJSONPath, `${schemaName}.json`);

  await writeFile(schemaFilePath, schemaJSON);
}
