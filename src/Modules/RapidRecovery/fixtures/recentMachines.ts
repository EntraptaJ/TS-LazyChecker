// src/Modules/Machines/fixtures/recentMachines.ts
import { AgentType } from '../RapidRecoveryAgentType';
import { ProtectedMachine } from '../MachineModel';
import { subHours } from 'date-fns';

export const recentMachines: ProtectedMachine[] = [
  {
    HasRecoveryPointsWithExchange: false,
    Id: 'a2e223c9-3fc3-4575-8090-2538a66ba998',
    DisplayName: 'cacti',
    AgentStatus: 0,
    AgentType: AgentType.ESXI_VM,
    AgentUrl:
      '/apprecovery/admin/ProtectedEsxVirtualMachines/a2e223c9-3fc3-4575-8090-2538a66ba998',
    LastSnapshot: `${subHours(new Date(), 30).toISOString()}`,
    NextSnapshot: '2021-01-17T04:00:00-06:00',
    LastSnapshotFormatted: '1/16/2021 4:02:46 AM',
    NextSnapshotFormatted: '1/17/2021 4:00:00 AM',
    AgentTypeTooltip: 'ESXi Virtual Machine',
    UIID: 'a2e223c9-3fc3-4575-8090-2538a66ba998',
    IsSelected: false,
    IsDisabled: false,
    Tooltip: '',
  },
];
