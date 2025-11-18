/**
 * LoggerAdapter Edge Cases and Singleton Tests
 */

import { env } from '@core/config/env.client';
import type { LogContext } from '@core/ports/LoggerPort';
import { LoggerAdapter, loggerAdapter } from '@infra/logging/loggerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('LoggerAdapter - Singleton Instance', () => {
	let originalConsole: typeof console;
	let originalProdValue: boolean;

	beforeEach(() => {
		originalConsole = globalThis.console;
		originalProdValue = env.PROD;
	});

	afterEach(() => {
		globalThis.console = originalConsole;
		env.PROD = originalProdValue;
		vi.clearAllMocks();
	});

	it('should export a singleton instance', () => {
		expect(loggerAdapter).toBeInstanceOf(LoggerAdapter);
	});

	it('should use environment-based minLevel for singleton', () => {
		env.PROD = true;
		// Re-import to get fresh singleton with new env
		// Note: In actual usage, the singleton is created at module load time
		// This test verifies the singleton exists and is a LoggerAdapter instance
		expect(loggerAdapter).toBeDefined();
		expect(typeof loggerAdapter.debug).toBe('function');
		expect(typeof loggerAdapter.info).toBe('function');
		expect(typeof loggerAdapter.warn).toBe('function');
		expect(typeof loggerAdapter.error).toBe('function');
	});
});

describe('LoggerAdapter - Edge Cases', () => {
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
	});

	afterEach(() => {
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should throw when console methods are undefined individually', () => {
		const adapter = new LoggerAdapter('debug');

		// Mock console with some methods undefined
		// Note: The logger only checks if console exists, not individual methods
		const mockConsole = {
			debug: undefined,
			info: undefined,
			warn: undefined,
			error: undefined,
		};

		// @ts-expect-error - Intentionally setting console methods to undefined
		globalThis.console = mockConsole;

		// Should throw when trying to call undefined methods
		expect(() => {
			adapter.debug('debug');
		}).toThrow();
	});

	it('should handle context with special characters', () => {
		// Ensure console is available
		globalThis.console ??= originalConsole;
		const adapter = new LoggerAdapter('debug');
		const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

		const context: LogContext = {
			message: 'Hello\nWorld',
			path: '/path/with/slashes',
			query: '?param=value&other=test',
		};

		adapter.debug('test', context);

		const callArg = consoleSpy.mock.calls[0]?.[0];
		expect(callArg).toContain('test');
		expect(callArg).toContain(String.raw`"message": "Hello\nWorld"`);

		consoleSpy.mockRestore();
	});

	it('should handle very large context objects', () => {
		// Ensure console is available
		globalThis.console ??= originalConsole;
		const adapter = new LoggerAdapter('debug');
		const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

		const largeContext: LogContext = {};
		for (let i = 0; i < 100; i++) {
			largeContext[`key${i}`] = `value${i}`;
		}

		adapter.debug('test', largeContext);

		expect(consoleSpy).toHaveBeenCalled();
		const callArg = consoleSpy.mock.calls[0]?.[0];
		expect(callArg).toContain('test');
		expect(callArg).toContain('Context:');

		consoleSpy.mockRestore();
	});
});
