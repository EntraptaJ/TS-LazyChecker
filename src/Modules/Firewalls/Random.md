```ts
/* const firewallController = firewallConfigController.getFirewall(
  'fw1.office1.kristianjones.dev',
);

logger.log(
  LogMode.DEBUG,
  `firewallController: `,
  await firewallController.getDiagnosticsInterfaceARP(),
);

const aliases = await firewallController.getFirewallAliases();

const coreAlias = aliases.find((alias) => alias.name === 'test_alias2');
if (!coreAlias) {
  throw new Error('Invalid alias');
}

const result = await firewallController.updateFirewallAlias(coreAlias.uuid, {
  ...coreAlias,
  type: 'host',
  content: '1.1.1.1\n1.0.0.1\n1.2.2.2',
});

logger.log(LogMode.DEBUG, `result: `, result);

/*
logger.log(LogMode.DEBUG, `firewallController: `); */

/* const alias = await firewallController.createFirewallAlias({
  content: '1.1.1.1\n2.2.2.2',
  description: 'TestingAlias1',
  enabled: '1',
  name: 'test_alias2',
  type: 'host',
}); */

// logger.log(LogMode.DEBUG, `alias: `, alias);

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
```
