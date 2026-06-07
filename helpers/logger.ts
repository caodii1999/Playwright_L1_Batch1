import type { TestInfo } from '@playwright/test';

type LogLevel = 'info' | 'success' | 'warn' | 'error';

const prefix: Record<LogLevel, string> = {
    info:    '[INFO]   ',
    success: '[SUCCESS]',
    warn:    '[WARN]   ',
    error:   '[ERROR]  ',
};

// --- Report support ---
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
}

const entries: LogEntry[] = [];

function log(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${prefix[level]} ${message}`);
    entries.push({ timestamp, level, message });
}

export const logger = {
    info:    (message: string) => log('info', message),
    success: (message: string) => log('success', message),
    warn:    (message: string) => log('warn', message),
    error:   (message: string) => log('error', message),

    getEntries: (): LogEntry[] => [...entries],
    clear:      (): void => { entries.splice(0); },

    toText: (): string =>
        entries
            .map(e => `${e.timestamp} ${prefix[e.level]} ${e.message}`)
            .join('\n'),

    attachToReport: async (testInfo: TestInfo): Promise<void> => {
        if (entries.length === 0) return;
        await testInfo.attach('logs', {
            body: logger.toText(),
            contentType: 'text/plain',
        });
    },
};