// src/Modules/Machines/MachineModel.ts
import { AgentType, AgentTypeTooltip } from './RapidRecoveryAgentType';

/**
 * Rapid Recovery Protected Machine
 */
export interface ProtectedMachine {
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
