// src/Library/Logging.ts
export enum LogMode {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

function getLogMode(value?: string | LogMode): LogMode {
  switch (value) {
    case 'DEBUG':
      return LogMode.DEBUG;
    case 'INFO':
      return LogMode.INFO;
    case 'WARN':
      return LogMode.WARN;
    case 'ERROR':
      return LogMode.ERROR;
    default:
      return process.env.NODE_ENV === 'production'
        ? LogMode.WARN
        : LogMode.INFO;
  }
}

export class Logger {
  public logMode: LogMode;

  public constructor() {
    this.logMode = getLogMode(process.env.LOG_MODE);
  }

  public log(mode: LogMode, msg: string, ...args: unknown[]): void {
    if (mode < this.logMode) {
      return;
    }

    switch (mode) {
      case LogMode.DEBUG:
        console.debug(msg, ...args);
        break;
      case LogMode.INFO:
        console.info(msg, ...args);
        break;
      case LogMode.WARN:
        console.warn(msg, ...args);
        break;
      case LogMode.ERROR:
        console.error(msg, ...args);
        break;
    }
  }
}

export const logger = new Logger();
