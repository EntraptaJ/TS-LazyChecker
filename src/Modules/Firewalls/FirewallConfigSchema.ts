// src/Modules/Firewalls/FirewallConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

const firewallAuth = jsonSchema
  .object()
  .description('OPNSense API Auth')
  .prop('key', jsonSchema.string().required())
  .prop('secret', jsonSchema.string().required());

const firewallSchema = jsonSchema
  .object()
  .description('OPNSense Firewall')
  .prop(
    'hostname',
    jsonSchema.string().description('Hostname/IP Address').required(),
  )
  .prop('auth', firewallAuth.required());

export const firewallConfigSchema = jsonSchema
  .object()
  .prop('firewalls', jsonSchema.array().items(firewallSchema).required());
