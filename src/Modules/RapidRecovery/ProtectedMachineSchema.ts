// src/Modules/Machines/ProtectedMachineSchema.ts
import jsonSchema from 'fluent-json-schema';

const protectedMachineSchema = jsonSchema
  .object()
  .id('#rrProtectedMachine')
  .prop('HasRecoveryPointsWithExchange', jsonSchema.boolean())
  .prop('Id', jsonSchema.string())
  .prop('DisplayName', jsonSchema.string())
  .prop('AgentStatus', jsonSchema.number())
  .prop('AgentType', jsonSchema.number())
  .prop('AgentTypeTooltip', jsonSchema.string())
  .prop('AgentUrl', jsonSchema.string())
  .prop('LastSnapshot', jsonSchema.string())
  .prop('LastSnapshotFormatted', jsonSchema.string())
  .prop('NextSnapshot', jsonSchema.string())
  .prop('NextSnapshotFormatted', jsonSchema.string())
  .prop('UIID', jsonSchema.string())
  .prop('IconTooltip', jsonSchema.null())
  .prop('IsSelected', jsonSchema.boolean())
  .prop('IsDisabled', jsonSchema.boolean())
  .prop('Tooltip', jsonSchema.string());

export const protectedMachineResponseSchema = jsonSchema
  .object()
  .prop('total', jsonSchema.number())
  .prop('page', jsonSchema.number())
  .prop('records', jsonSchema.number())
  .prop('rows', jsonSchema.array().items(protectedMachineSchema));

export const protectedMachineRequestHeaderSchema = jsonSchema
  .object()
  .prop('Content-Type', jsonSchema.string().required())
  .prop('Cookie', jsonSchema.string().required());

export const protectedMachineRequestBodySchema = jsonSchema
  .object()
  .prop('PageSize', jsonSchema.number().required())
  .prop('rows', jsonSchema.number().required())
  .prop('page', jsonSchema.number().required())
  .prop('sidx', jsonSchema.string().required())
  .prop('sord', jsonSchema.string().required())
  .prop('Page', jsonSchema.number().required())
  .prop('IsVirtualScrolling', jsonSchema.boolean().required())
  .prop('SortOrder', jsonSchema.string().required())
  .prop('SortName', jsonSchema.string().required())
  .prop('_search', jsonSchema.boolean().required());
