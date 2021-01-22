// src/Modules/SecurityZones/NetworkConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

const securityZoneSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .prop(
    'name',
    jsonSchema.string().description('Zone friendly name').required(),
  )
  .prop('id', jsonSchema.number().description('Security Zone Id'));

export const securityZoneConfigSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .prop(
    'zones',
    jsonSchema
      .array()
      .items(securityZoneSchema)
      .description('Array of Security Zone Objects')
      .required(),
  );
