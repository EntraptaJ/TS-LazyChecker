// src/Module/Checks/CheckModel.ts
import { CheckedMachine } from './CheckedMachine';

export class Check {
  public date: Date;

  public checkedMachines: CheckedMachine[];

  public constructor(options: Partial<Omit<Check, 'date'>>) {
    this.date = new Date();

    Object.assign(this, options);
  }
}
