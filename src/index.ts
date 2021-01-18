// src/index.ts
import { logger, LogMode } from './Library/Logging';
import { configController } from './Modules/Config/ConfigController';
// import { startScheduler } from './Modules/Schedule/Scheduler';
import './setup';

logger.log(LogMode.INFO, 'Starting TS-LazyChecker');

const configPath = process.env.CONFIG_PATH || 'config.yml';

await configController.loadConfig(configPath);

const [{ firewallConfigController }] = await Promise.all([
  import('./Modules/Firewalls/FirewallConfigController'),
]);

await firewallConfigController.loadFile();

const firewallController = firewallConfigController.getFirewall(
  'fw1.office1.kristianjones.dev',
);

const aliases = await firewallController.getFirewallAliases();

const coreAlias = aliases.find((alias) => alias.name === 'random123');
if (!coreAlias) {
  throw new Error('Invalid alias');
}

await firewallController.updateFirewallAlias(coreAlias.uuid, {
  ...coreAlias,
  type: 'host',
  content: '1.1.1.1\n1.0.0.1\n1.2.2.2',
});

logger.log(LogMode.DEBUG, `firewallController: `);

/* await firewallController.createFirewallAlias({
  content: '1.1.1.1',
  description: 'HelloWorld123',
  enabled: '1',
  name: 'random123',
  type: 'host',
}); */

/* const [
  diagnosticsInterfaceRoutes,
  diagnosticsInterfaceARPs,
  diagnosticsInterfaceNames,
  FirewallAlias,
] = await Promise.all([
  firewallController.getDiagnosticsInterfaceRoutes(),
  firewallController.getDiagnosticsInterfaceARP(),
  firewallController.getDiagnosticsInterfaceNames(),
  firewallController.getFirewallAliases(),
]);

logger.log(LogMode.DEBUG, `Alias: `, FirewallAlias);
 */
/* for (const diagnosticsInterfaceARP of diagnosticsInterfaceARPs) {
  logger.log(
    LogMode.DEBUG,
    `diagnosticsInterfaceARP\nMAC: `,
    diagnosticsInterfaceARP.mac,
    `\nIP: ${diagnosticsInterfaceARP.ip}`,
  );
} */

/* for (const diagnosticsInterfaceRoute of diagnosticsInterfaceRoutes) {
  logger.log(
    LogMode.DEBUG,
    `diagnosticsInterfaceRoute: `,
    diagnosticsInterfaceRoute,
  );
} */

// await startScheduler();

logger.log(LogMode.INFO, 'Started TS-LazyChecker');
