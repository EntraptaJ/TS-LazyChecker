// src/Modules/SecurityZones/SecurityZone.ts
export class SecurityZone {
  public name: string;

  public id: number;

  public get vlanId(): number {
    return parseInt(`1${this.id}`);
  }

  public constructor(options: Partial<SecurityZone>) {
    Object.assign(this, options);
  }
}
