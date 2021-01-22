/* eslint-disable @typescript-eslint/explicit-function-return-type */
// src/bin/generateSchema.ts
import { ObjectSchema } from 'fluent-json-schema';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

import { saveSchemaToDisk, saveSchemaTypesToDisk } from './Utils';

const schemaJSONPath = resolve(
  fileURLToPath(import.meta.url),
  '../../../../schemas',
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
  outputTypes: string;
  schemaName: string;
};

const schemas: SchemaFile[] = [
  {
    importModule: () => import('../../Modules/Config/ConfigSchema'),
    outputTypes: '../../Modules/Config/Config.ts',
    schemaName: 'Config',
  },
  {
    importModule: () =>
      import('../../Modules/SecurityZones/SecurityZoneConfigSchema'),
    outputTypes: '../../Modules/SecurityZones/SecurityZoneConfig.ts',
    schemaName: 'Zones',
  },
  {
    importModule: () => import('../../Modules/Firewalls/FirewallConfigSchema'),
    outputTypes: '../../Modules/Firewalls/FirewallConfig.ts',
    schemaName: 'Firewalls',
  },
];

const selectedSchema = schemas.find(
  (schema) => schema.schemaName === schemaName,
);
if (!selectedSchema) {
  throw new Error('Invalid schema name. Schema not found');
}

const importedModule = await selectedSchema.importModule();

for (const [, exportedSchema] of Object.entries(importedModule)) {
  const jsonSchema = exportedSchema.valueOf();
  const schemaFilePath = resolve(schemaJSONPath, `${schemaName}.json`);
  const typePath = resolve(
    fileURLToPath(import.meta.url),
    '../',
    selectedSchema.outputTypes,
  );

  await Promise.all([
    saveSchemaToDisk(jsonSchema, schemaFilePath),
    saveSchemaTypesToDisk(jsonSchema, schemaName, typePath),
  ]);
}
