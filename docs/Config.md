# KristianFJones/TS-LazyChecker Configuration Docs

The configuration file is a yaml file.

| Configuration Key                 | Description                                                                            | Default                         | Example                                                           | Required |
| --------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------- | -------- |
| controllerUri                     | RapidRecovery Controller URI                                                           |                                 | https://192.168.254.111:8006                                      | YES      |
| defaultDaysWithoutBackup          | Default days to alert upon if backups haven't been taken in X Days                     | 1                               |                                                                   | NO       |
| schedule                          | CRON Type Schedule                                                                     | `*/1 * * * *`                   | `30 */12 * * *`                                                   | NO       |
| overwriteSchedule                 | Overwrite exising schedule, needed if you change the schedule                          | false                           | true                                                              | NO       |
| teamsWebHook                      | Microsoft Teams incoming WebHook                                                       |                                 | https://outlook.office.com/webhook/ABCXYZ/IncomingWebhook/KEY/KEY | NO       |
| auth                              | Authenication for the RapidRecovery Web UI                                             |                                 |                                                                   | YES      |
| auth.username                     | Username for RR Web Access                                                             |                                 |                                                                   | YES      |
| auth.password                     | Password for RR Web Access                                                             |                                 |                                                                   | YES      |
| watchedMachines                   | Array of Machines to ensure backups have been taken within time period                 | []                              |                                                                   | YES      |
| watchedMachines.name              | Name to use in alerts and notifications                                                |                                 |                                                                   | YES      |
| watchedMachines.id                | RapidRecovery Machine ID. Can be obtained from the Machine Web Page on the RR Admin UI |                                 |                                                                   | YES      |
| watchedMachines.daysWithoutBackup | Days that equal or or above will trigger an alert                                      | config.defaultDaysWithoutBackup |                                                                   | NO       |

Config Example:

```yml
controllerUri: https://192.168.254.111:8006

teamsWebHook: https://outlook.office.com/webhook/KEY

auth:
  username: administrator
  password: password

watchedMachines:
  - name: Finane
    id: 5d0a35fc-097f-11eb-adc1-0242ac120002
    daysWithoutBackup: 1
```
