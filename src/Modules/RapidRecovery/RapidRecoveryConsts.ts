// src/Modules/Machines/MachineRequest.ts
import type { RequestOptions } from '@elastic.io/ntlm-client';

export const MachineRequestBody: RequestOptions['request']['body'] = {
  _search: false,
  PageSize: 200,
  rows: 200,
  page: 1,
  sidx: '',
  sord: 'asc',
  Page: 1,
  IsVirtualScrolling: false,
  SortOrder: 'asc',
  SortName: '',
};

export const MachineRequestHeaders: RequestOptions['request']['headers'] = {
  'Content-Type': 'application/json',
  Cookie: 'CoreVersion=6.5.0.724',
};
