// src/Modules/Config/ConfigSchema.ts
import jsonSchema from 'fluent-json-schema';
import { networkConfigSchema } from '../Networks/NetworkConfigSchema';

const configAuthSchema = jsonSchema
  .object()
  .id('auth')
  .description('Rapid Recovery Authenication Information')
  .prop('username', jsonSchema.string().required())
  .prop('password', jsonSchema.string().required());

const watchedMachineSchema = jsonSchema
  .object()
  .id('watchedMachine')
  .definition('TS-LazyChecker monitored servers')
  .prop(
    'name',
    jsonSchema
      .string()
      .description('Friendly name of machine to use in logs and notifications')
      .required(),
  )
  .prop(
    'id',
    jsonSchema
      .string()
      .format(jsonSchema.FORMATS.UUID)
      .description('RapidRecovery Machine ID')
      .required(),
  )
  .prop(
    'daysWithoutBackup',
    jsonSchema
      .number()
      .description(
        'Days to go since last backup/snapshot before raising any alarms',
      ),
  );

export const configSchema = jsonSchema
  .object()
  .prop('networks', jsonSchema.array().items(networkConfigSchema))
  .prop(
    'controllerUri',
    jsonSchema
      .string()
      .format(jsonSchema.FORMATS.URI)
      .description('RapidRecovery Web URI')
      .required(),
  )
  .definition('auth', configAuthSchema)
  .prop('auth', configAuthSchema)
  .prop(
    'overwriteSchedule',
    jsonSchema
      .boolean()
      .description(
        'Force clearing of existing Schedule, required if changing the crontab string',
      ),
  )
  .prop('scheduleStartTime', jsonSchema.string())
  .prop(
    'defaultDaysWithoutBackup',
    jsonSchema
      .number()
      .description(
        'Default days before a machine triggers an alert due to missed snapshots/backups',
      )
      .default(1),
  )
  .prop(
    'teamsWebHook',
    jsonSchema
      .string()
      .description('Optional Teams Channel webhook for ChatOps notifications'),
  )
  .prop(
    'schedule',
    jsonSchema.string().description('Crontab string for check schedule'),
  )
  .prop(
    'watchedMachines',
    jsonSchema.array().items(watchedMachineSchema).required(),
  );
