// src/Modules/Machines/MachineRequest.ts
import type { RequestOptions } from '@elastic.io/ntlm-client';

export const MachineRequestBody: RequestOptions['request']['body'] = {
  PageSize: 100,
  rows: 20,
  page: 1,
  sidx: '',
  sord: 'asc',
  Page: 1,
  IsVirtualScrolling: false,
  SortOrder: 'asc',
  SortName: '',
  ByContent: '',
};

export const MachineRequestHeaders: RequestOptions['request']['headers'] = {
  'Content-Type': 'application/json',
  Cookie: 'CoreVersion=6.4.0.718',
};
