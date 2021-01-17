// src/Modules/RapidRecovery/fixtures/RRMachine.ts
import { ProtectedMachine } from '../MachineModel';

export interface RRMachineResponse {
  total: number;
  page: number;
  records: number;
  rows: ProtectedMachine[];
}
