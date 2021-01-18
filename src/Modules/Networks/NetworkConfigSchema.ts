// src/Modules/Networks/NetworkConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

export const networkConfigSchema = jsonSchema
  .object()
  .prop(
    'name',
    jsonSchema.string().description('Network public name').required(),
  )
  .prop('networkSpace', jsonSchema.string().description('IPv4 Network'));
