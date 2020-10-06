// src/Modules/Machines/MachineModel.ts

import { AgentType, AgentTypeTooltip } from './AgentType';

/**
 * Rapid Recovery Protected Machine
 */
export interface Machine {
  AgentStatus: number;

  Id: string;

  AgentType: AgentType;

  AgentTypeTooltip: AgentTypeTooltip;

  AgentUrl: string;

  LastSnapshot: string;

  LastSnapshotFormatted: string;

  NextSnapshot: string;

  NextSnapshotFormatted: string;

  UIID: string;
}
