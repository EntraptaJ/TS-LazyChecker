// src/Modules/Checks/CheckedMachine.ts
import { Machine } from '../Machines/MachineModel';

let id = 0;

export class CheckedMachine {
  public id: number;

  public machineName: string;

  public machineId: string;

  public daysSinceLastSnapshot: number;

  public machine: Machine;

  public constructor(options: Partial<Omit<CheckedMachine, 'id'>>) {
    this.id = id++;

    Object.assign(this, options);
  }
}
