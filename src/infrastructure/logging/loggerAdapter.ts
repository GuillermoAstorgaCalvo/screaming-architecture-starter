import { env } from '@core/config/env.client';
import type { LogContext, LoggerPort, LogLevel } from '@core/ports/LoggerPort';

/**
 * LoggerAdapter - Console-based logging implementation
 *
 * Provides SSR-safe console logging with structured error reporting.
 * This adapter can be extended or replaced with external services (e.g., Sentry, LogRocket) without changing domain code.
 *
 * Guidelines:
 * - Always gate browser APIs for SSR/test environments
 * - Domains/services should NOT access console directly; use this adapter
 * - Production environments should integrate with proper error reporting services
 */
export class LoggerAdapter implements LoggerPort {
	private readonly isAvailable: boolean;
	private readonly minLevel: LogLevel;

	constructor(minLevel?: LogLevel) {
		// Check if console is available (not in SSR or restricted environments)
		this.isAvailable = typeof console !== 'undefined';
		// Set minLevel based on environment if not provided:
		// - Production: 'warn' (only warnings and errors)
		// - Development: 'debug' (all logs)
		this.minLevel = minLevel ?? (env.PROD ? 'warn' : 'debug');
	}

	/**
	 * Check if a log level should be logged based on the minimum level
	 */
	private shouldLog(level: LogLevel): boolean {
		if (!this.isAvailable) {
			return false;
		}

		const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
		const currentLevelIndex = levels.indexOf(level);
		const minLevelIndex = levels.indexOf(this.minLevel);

		return currentLevelIndex >= minLevelIndex;
	}

	/**
	 * Format log message with context
	 */
	private formatMessage(message: string, context?: LogContext): string {
		if (context && Object.keys(context).length > 0) {
			try {
				const contextString = JSON.stringify(context, null, 2);
				return `${message}\nContext: ${contextString}`;
			} catch {
				// Fallback if JSON.stringify fails (circular references, etc.)
				return `${message}\nContext: [Unable to stringify context]`;
			}
		}

		return message;
	}

	debug(message: string, context?: LogContext): void {
		if (!this.shouldLog('debug')) {
			return;
		}

		const formattedMessage = this.formatMessage(message, context);
		// eslint-disable-next-line no-console -- Logger adapter intentionally uses console for debug logs
		console.debug(formattedMessage);
	}

	info(message: string, context?: LogContext): void {
		if (!this.shouldLog('info')) {
			return;
		}

		const formattedMessage = this.formatMessage(message, context);
		// eslint-disable-next-line no-console -- Logger adapter intentionally uses console for info logs
		console.info(formattedMessage);
	}

	warn(message: string, context?: LogContext): void {
		if (!this.shouldLog('warn')) {
			return;
		}

		const formattedMessage = this.formatMessage(message, context);
		console.warn(formattedMessage);
	}

	error(message: string, error?: unknown, context?: LogContext): void {
		if (!this.shouldLog('error')) {
			return;
		}

		const formattedMessage = this.formatMessage(message, context);

		if (error instanceof Error) {
			console.error(formattedMessage, error);
		} else if (error) {
			console.error(formattedMessage, error);
		} else {
			console.error(formattedMessage);
		}
	}
}

/**
 * Singleton instance of LoggerAdapter
 * Use this instance throughout the application to ensure consistent logging
 *
 * Automatically sets minLevel based on environment:
 * - Production: 'warn' (suppresses info and debug logs)
 * - Development: 'debug' (shows all logs)
 *
 * For production environments, consider:
 * - Integrating with Sentry, LogRocket, or similar services
 * - Adding log aggregation and filtering
 */
export const loggerAdapter = new LoggerAdapter();
