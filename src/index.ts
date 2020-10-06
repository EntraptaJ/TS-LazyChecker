// src/index.ts

import { loadConfig } from './Modules/Config/loadConfig';
import { getMachines } from './Modules/Machines/getMachines';

console.log(`Starting TS-Core`);

const configPath = process.env.CONFIG_PATH || 'config.yml';

const appConfig = await loadConfig(configPath);

const machines = await getMachines(appConfig);

const watchedIds = appConfig.watchedMachines.map(({ id }) => id);

const watchedMachines = machines.filter(({ Id }) => watchedIds.includes(Id));

for (const machine of watchedMachines) {
  console.log(machine);
}

// for (const vm of vms) {
//   const lastBackup = new Date(vm.LastSnapshot);

//   // const daysSinceBackup = 1;
//   const daysSinceBackup = differenceInCalendarDays(currentDate, lastBackup);

//   if (daysSinceBackup >= 1) {
//     console.warn(
//       `It's been ${daysSinceBackup} day since last backup of ${vm.DisplayName}`,
//     );
//   }
// }
