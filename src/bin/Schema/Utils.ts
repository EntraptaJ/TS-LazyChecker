/* eslint-disable @typescript-eslint/ban-types */
// src/bin/Schema/Utils.ts
import { writeFile } from 'fs/promises';
import { PathLike } from 'fs';
import { compile } from 'json-schema-to-typescript';

export function saveSchemaToDisk(
  schema: Object,
  outputFilePath: PathLike,
): Promise<void> {
  const schemaJSON = JSON.stringify(schema);

  return writeFile(outputFilePath, schemaJSON);
}

export async function saveSchemaTypesToDisk(
  schema: Object,
  schemaName: string,
  outputFilePath: PathLike,
): Promise<void> {
  const types = await compile(schema, schemaName);

  return writeFile(outputFilePath, types);
}
