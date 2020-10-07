// src/Modules/Machines/MachineModel.ts
import { AgentType, AgentTypeTooltip } from './AgentType';

/**
 * Rapid Recovery Protected Machine
 */
export interface Machine {
  HasRecoveryPointsWithExchange: boolean;

  Id: string;

  DisplayName: string;

  AgentStatus: number;

  AgentType: AgentType;

  AgentTypeTooltip: AgentTypeTooltip;

  AgentUrl: string;

  LastSnapshot: string;

  LastSnapshotFormatted: string;

  NextSnapshot: string;

  NextSnapshotFormatted: string;

  UIID: string;

  IconTooltip?: string;

  IsSelected: boolean;

  IsDisabled: boolean;

  Tooltip: string;
}
