type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  context?: Record<string, any>;
}

const log = (level: LogLevel, message: string, options?: LogOptions) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...options?.context,
  };

  // In a real application, you would send this to a logging service (e.g., Sentry, Logtail)
  // For now, we'll just log to the console.
  switch (level) {
    case 'info':
      console.info(JSON.stringify(logEntry));
      break;
    case 'warn':
      console.warn(JSON.stringify(logEntry));
      break;
    case 'error':
      console.error(JSON.stringify(logEntry));
      break;
    case 'debug':
      console.debug(JSON.stringify(logEntry));
      break;
    default:
      console.log(JSON.stringify(logEntry));
  }
};

export const logger = {
  info: (message: string, context?: Record<string, any>) => log('info', message, { context }),
  warn: (message: string, context?: Record<string, any>) => log('warn', message, { context }),
  error: (message: string, context?: Record<string, any>) => log('error', message, { context }),
  debug: (message: string, context?: Record<string, any>) => log('debug', message, { context }),
};
