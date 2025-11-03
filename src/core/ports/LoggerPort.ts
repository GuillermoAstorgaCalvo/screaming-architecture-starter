/**
 * LoggerPort - Interface for application-wide logging
 *
 * Hexagonal architecture port: defines the contract for logging operations.
 * Infrastructure adapters implement this interface, while domains depend only on the port.
 *
 * This abstraction enables:
 * - Centralized logging with different log levels
 * - Easy testing with mock implementations
 * - Swapping logging backends (console, Sentry, etc.) without changing domain code
 * - SSR-safe logging operations
 * - Structured error reporting for debugging
 */

/**
 * Log severity levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Additional context data to include with log messages
 */
export type LogContext = Record<string, unknown>;

/**
 * LoggerPort - Interface for logging operations
 *
 * Defines the contract for application-wide logging. All methods are synchronous
 * and should handle SSR environments gracefully.
 */
export interface LoggerPort {
	/**
	 * Log a debug message
	 * @param message - The log message
	 * @param context - Optional context data
	 */
	debug(message: string, context?: LogContext): void;

	/**
	 * Log an info message
	 * @param message - The log message
	 * @param context - Optional context data
	 */
	info(message: string, context?: LogContext): void;

	/**
	 * Log a warning message
	 * @param message - The log message
	 * @param context - Optional context data
	 */
	warn(message: string, context?: LogContext): void;

	/**
	 * Log an error message
	 * @param message - The log message
	 * @param error - Optional error object (Error instance or any other value)
	 * @param context - Optional context data
	 */
	error(message: string, error?: unknown, context?: LogContext): void;
}
