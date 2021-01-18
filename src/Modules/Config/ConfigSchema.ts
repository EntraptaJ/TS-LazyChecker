// src/Modules/Config/ConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

const configAuthSchema = jsonSchema
  .object()
  .id('auth')
  .description('Rapid Recovery Authenication Information')
  .prop('username', jsonSchema.string().required())
  .prop('password', jsonSchema.string().required());

export const configSchema = jsonSchema
  .object()
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
    'teamsWebHook',
    jsonSchema
      .string()
      .description('Optional Teams Channel webhook for ChatOps notifications'),
  )
  .prop(
    'schedule',
    jsonSchema.string().description('Crontab string for check schedule'),
  );
