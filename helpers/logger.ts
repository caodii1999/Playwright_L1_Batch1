type LogLevel = 'info' | 'success' | 'warn' | 'error';

const prefix: Record<LogLevel, string> = {
    info:    '[INFO]   ',
    success: '[SUCCESS]',
    warn:    '[WARN]   ',
    error:   '[ERROR]  ',
};

function log(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${prefix[level]} ${message}`);
}

export const logger = {
    info:    (message: string) => log('info', message),
    success: (message: string) => log('success', message),
    warn:    (message: string) => log('warn', message),
    error:   (message: string) => log('error', message),
};