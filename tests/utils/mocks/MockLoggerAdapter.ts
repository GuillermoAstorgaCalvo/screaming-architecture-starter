import type { LoggerPort } from '@core/ports/LoggerPort';

/**
 * Mock LoggerPort implementation for testing
 * Collects logs for assertions and suppresses console output during tests
 */
export class MockLoggerAdapter implements LoggerPort {
	public readonly logs: Array<{
		level: 'debug' | 'info' | 'warn' | 'error';
		message: string;
		context?: Record<string, unknown>;
		error?: unknown;
	}> = [];

	debug(message: string, context?: Record<string, unknown>): void {
		this.logs.push({ level: 'debug', message, ...(context && { context }) });
	}

	info(message: string, context?: Record<string, unknown>): void {
		this.logs.push({ level: 'info', message, ...(context && { context }) });
	}

	warn(message: string, context?: Record<string, unknown>): void {
		this.logs.push({ level: 'warn', message, ...(context && { context }) });
	}

	error(message: string, error?: unknown, context?: Record<string, unknown>): void {
		this.logs.push({
			level: 'error',
			message,
			...(error !== undefined && { error }),
			...(context && { context }),
		});
	}

	/**
	 * Test helper: Clear all logs (useful for test cleanup)
	 */
	reset(): void {
		this.logs.length = 0;
	}
}
