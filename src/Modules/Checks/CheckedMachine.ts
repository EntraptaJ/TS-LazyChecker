// src/Modules/Checks/CheckedMachine.ts
import hyperid from 'hyperid';
import { ProtectedMachine } from '../RapidRecovery/MachineModel';

export class CheckedMachine {
  public id: string = hyperid().uuid;

  public machineName: string;

  public machineId: string;

  public daysSinceLastSnapshot: number;

  public machine: ProtectedMachine;

  public constructor(options: Partial<Omit<CheckedMachine, 'id'>>) {
    Object.assign(this, options);
  }
}
