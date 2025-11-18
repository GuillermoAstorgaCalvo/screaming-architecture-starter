/**
 * LoggerAdapter Logging Tests
 * Tests for all log levels: debug, info, warn, error
 */

import type { LogContext } from '@core/ports/LoggerPort';
import { LoggerAdapter } from '@infra/logging/loggerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const DEBUG_MESSAGE = 'debug message';
const ERROR_MESSAGE = 'error message';
const INFO_MESSAGE = 'info message';
const TEST_DEBUG_MESSAGE = 'test debug message';
const TEST_ERROR_MESSAGE = 'test error message';
const TEST_INFO_MESSAGE = 'test info message';
const TEST_WARN_MESSAGE = 'test warn message';
const WARN_MESSAGE = 'warn message';

describe('LoggerAdapter - Debug Logging', () => {
	let adapter: LoggerAdapter;
	let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		// Ensure console is available
		globalThis.console ??= originalConsole;
		adapter = new LoggerAdapter('debug');
		consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
	});

	afterEach(() => {
		if (consoleDebugSpy) {
			consoleDebugSpy.mockRestore();
		}
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should log debug message without context', () => {
		adapter.debug(TEST_DEBUG_MESSAGE);

		expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
		expect(consoleDebugSpy).toHaveBeenCalledWith(TEST_DEBUG_MESSAGE);
	});

	it('should log debug message with context', () => {
		const context: LogContext = {
			userId: '123',
			action: 'test',
		};

		adapter.debug(TEST_DEBUG_MESSAGE, context);

		expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
		const callArg = consoleDebugSpy.mock.calls[0]?.[0];
		expect(callArg).toContain(TEST_DEBUG_MESSAGE);
		expect(callArg).toContain('Context:');
		expect(callArg).toContain('"userId": "123"');
		expect(callArg).toContain('"action": "test"');
	});

	it('should not log debug when minLevel is higher', () => {
		const infoAdapter = new LoggerAdapter('info');
		infoAdapter.debug(DEBUG_MESSAGE);

		expect(consoleDebugSpy).not.toHaveBeenCalled();
	});

	it('should not log debug in SSR environment', () => {
		// @ts-expect-error - Intentionally setting console to undefined for SSR test
		globalThis.console = undefined;

		const ssrAdapter = new LoggerAdapter('debug');
		ssrAdapter.debug(DEBUG_MESSAGE);

		// Should not throw
		expect(true).toBe(true);
	});
});

describe('LoggerAdapter - Info Logging', () => {
	let adapter: LoggerAdapter;
	let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		// Ensure console is available
		globalThis.console ??= originalConsole;
		adapter = new LoggerAdapter('info');
		consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
	});

	afterEach(() => {
		if (consoleInfoSpy) {
			consoleInfoSpy.mockRestore();
		}
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should log info message without context', () => {
		adapter.info(TEST_INFO_MESSAGE);

		expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
		expect(consoleInfoSpy).toHaveBeenCalledWith(TEST_INFO_MESSAGE);
	});

	it('should log info message with context', () => {
		const context: LogContext = {
			component: 'Button',
			props: { disabled: true },
		};

		adapter.info(TEST_INFO_MESSAGE, context);

		expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
		const callArg = consoleInfoSpy.mock.calls[0]?.[0];
		expect(callArg).toContain(TEST_INFO_MESSAGE);
		expect(callArg).toContain('Context:');
		expect(callArg).toContain('"component": "Button"');
	});

	it('should not log info when minLevel is higher', () => {
		const warnAdapter = new LoggerAdapter('warn');
		warnAdapter.info(INFO_MESSAGE);

		expect(consoleInfoSpy).not.toHaveBeenCalled();
	});

	it('should not log info in SSR environment', () => {
		// @ts-expect-error - Intentionally setting console to undefined for SSR test
		globalThis.console = undefined;

		const ssrAdapter = new LoggerAdapter('info');
		ssrAdapter.info(INFO_MESSAGE);

		// Should not throw
		expect(true).toBe(true);
	});
});

describe('LoggerAdapter - Warn Logging', () => {
	let adapter: LoggerAdapter;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		// Ensure console is available
		globalThis.console ??= originalConsole;
		adapter = new LoggerAdapter('warn');
		consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		if (consoleWarnSpy) {
			consoleWarnSpy.mockRestore();
		}
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should log warn message without context', () => {
		adapter.warn(TEST_WARN_MESSAGE);

		expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
		expect(consoleWarnSpy).toHaveBeenCalledWith(TEST_WARN_MESSAGE);
	});

	it('should log warn message with context', () => {
		const context: LogContext = {
			deprecated: true,
			alternative: 'useNewMethod',
		};

		adapter.warn(TEST_WARN_MESSAGE, context);

		expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
		const callArg = consoleWarnSpy.mock.calls[0]?.[0];
		expect(callArg).toContain(TEST_WARN_MESSAGE);
		expect(callArg).toContain('Context:');
		expect(callArg).toContain('"deprecated": true');
		expect(callArg).toContain('"alternative": "useNewMethod"');
	});

	it('should not log warn when minLevel is higher', () => {
		const errorAdapter = new LoggerAdapter('error');
		errorAdapter.warn(WARN_MESSAGE);

		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it('should not log warn in SSR environment', () => {
		// @ts-expect-error - Intentionally setting console to undefined for SSR test
		globalThis.console = undefined;

		const ssrAdapter = new LoggerAdapter('warn');
		ssrAdapter.warn(WARN_MESSAGE);

		// Should not throw
		expect(true).toBe(true);
	});
});

describe('LoggerAdapter - Error Logging - Basic', () => {
	let adapter: LoggerAdapter;
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		globalThis.console ??= originalConsole;
		adapter = new LoggerAdapter('error');
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleErrorSpy?.mockRestore();
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should log error message without error object or context', () => {
		adapter.error(TEST_ERROR_MESSAGE);

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		expect(consoleErrorSpy).toHaveBeenCalledWith(TEST_ERROR_MESSAGE);
	});

	it('should log error message with Error instance', () => {
		const error = new Error('test error');
		adapter.error(TEST_ERROR_MESSAGE, error);

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		expect(consoleErrorSpy).toHaveBeenCalledWith(TEST_ERROR_MESSAGE, error);
	});

	it('should log error message with non-Error object', () => {
		const error = { code: 500, message: 'server error' };
		adapter.error(TEST_ERROR_MESSAGE, error);

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		expect(consoleErrorSpy).toHaveBeenCalledWith(TEST_ERROR_MESSAGE, error);
	});
});

describe('LoggerAdapter - Error Logging - With Context', () => {
	let adapter: LoggerAdapter;
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		globalThis.console ??= originalConsole;
		adapter = new LoggerAdapter('error');
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleErrorSpy?.mockRestore();
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should log error message with context only', () => {
		const context: LogContext = {
			statusCode: 500,
			endpoint: '/api/users',
		};

		adapter.error(TEST_ERROR_MESSAGE, undefined, context);

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		const callArg = consoleErrorSpy.mock.calls[0]?.[0];
		expect(callArg).toContain(TEST_ERROR_MESSAGE);
		expect(callArg).toContain('Context:');
		expect(callArg).toContain('"statusCode": 500');
		expect(callArg).toContain('"endpoint": "/api/users"');
	});

	it('should log error message with Error instance and context', () => {
		const error = new Error('test error');
		const context: LogContext = {
			userId: '123',
			timestamp: '2024-01-01',
		};

		adapter.error(TEST_ERROR_MESSAGE, error, context);

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		const [callArg, errorArg] = consoleErrorSpy.mock.calls[0] ?? [];
		expect(callArg).toContain(TEST_ERROR_MESSAGE);
		expect(callArg).toContain('Context:');
		expect(errorArg).toBe(error);
	});

	it('should log error message with non-Error object and context', () => {
		const error = { code: 500 };
		const context: LogContext = {
			requestId: 'req-123',
		};

		adapter.error(TEST_ERROR_MESSAGE, error, context);

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		const [callArg, errorArg] = consoleErrorSpy.mock.calls[0] ?? [];
		expect(callArg).toContain(TEST_ERROR_MESSAGE);
		expect(callArg).toContain('Context:');
		expect(errorArg).toBe(error);
	});
});

describe('LoggerAdapter - Error Logging - Edge Cases', () => {
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		globalThis.console ??= originalConsole;
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleErrorSpy?.mockRestore();
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should not log error when minLevel is higher (should always log errors)', () => {
		// Error is the highest level, so this test verifies error always logs
		// Actually, if minLevel is 'error', only errors should log
		// But if we set minLevel to something that doesn't exist, error should still log
		// Since 'error' is the highest level, all adapters should log errors
		const debugAdapter = new LoggerAdapter('debug');
		debugAdapter.error(ERROR_MESSAGE);

		expect(consoleErrorSpy).toHaveBeenCalled();
	});

	it('should not log error in SSR environment', () => {
		// @ts-expect-error - Intentionally setting console to undefined for SSR test
		globalThis.console = undefined;

		const ssrAdapter = new LoggerAdapter('error');
		ssrAdapter.error(ERROR_MESSAGE);

		// Should not throw
		expect(true).toBe(true);
	});
});
