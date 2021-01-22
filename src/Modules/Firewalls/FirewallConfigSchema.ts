// src/Modules/Firewalls/FirewallConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

const firewallAuth = jsonSchema
  .object()
  .additionalProperties(false)
  .description('OPNSense API Auth')
  .prop('key', jsonSchema.string().required())
  .prop('secret', jsonSchema.string().required());

const firewallSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .description('OPNSense Firewall')
  .prop(
    'hostname',
    jsonSchema.string().description('Hostname/IP Address').required(),
  )
  .prop('auth', firewallAuth.required())
  .required(['auth']);

export const firewallConfigSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .prop('firewalls', jsonSchema.array().items(firewallSchema).required());
