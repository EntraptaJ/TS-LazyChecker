// src/Modules/SecurityZones/NetworkConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

const securityZoneSchema = jsonSchema
  .object()
  .prop(
    'name',
    jsonSchema.string().description('Zone friendly name').required(),
  )
  .prop('id', jsonSchema.number().description('Security Zone Id'));

export const securityZoneConfigSchema = jsonSchema
  .object()
  .prop('zones', jsonSchema.array().items(securityZoneSchema).required());
