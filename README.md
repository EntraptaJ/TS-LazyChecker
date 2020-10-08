# KristianFJones/TS-LazyChecker

This is a project to automate the checks of a RapidRecovery appliance to ensure backups for speficied VMs have been taken within X days.

## Usage

`docker-compose.yml`

```yml
version: '3.8'

networks:
  internalRedis:
    ipam:
      driver: default
      config:
        - subnet: 172.16.42.0/24

configs:
  TSCheckerConfig:
    name: TSCheckerConfig-1
    file: ./config.yml

services:
  TS-Checker:
    image: kristianfjones/ts-lazychecker
    deploy:
      replicas: 3
    configs:
      - source: TSCheckerConfig
        target: /app/config.yml
    networks:
      - internalRedis

  Redis:
    image: redis:alpine
    networks:
      - internalRedis
```

`./config.yml`

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

```sh
docker stack deploy TSChecker
```

## Development

### Setting up the development container

Follow these steps to open this project in a container:

1. If this is your first time using a development container, please follow the [getting started steps](https://aka.ms/vscode-remote/containers/getting-started).

2. To use this repository, you can either open the repository in an isolated Docker volume:

   - Press <kbd>F1</kbd> and select the **Remote-Containers: Open Repository in Container...** command.
   - Enter `K-FOSS/TS-Core-Template`
   - The VS Code window (instance) will reload, clone the source code, and start building the dev container. A progress notification provides status updates.

   Or open a locally cloned copy of the code:

   - Clone this repository to your local filesystem.
     - `git clone https://github.com/K-FOSS/TS-Core-Template.git`
   - Open the project folder in Visual Studio Code.
     - `code ./TS-Core-Template`
   - Reopen in Container

     - When you open the project folder in Visual Studio Code you should be prompted with a notification asking if you would like to reopen in container.

     Or manually reopen

     - Press F1 and select the "Remote-Containers: Open Folder in Container..." command.

### Running

Open a VSCode Terminal

```
npm run dev
```

Or launch with the VSCode Debugging tab
