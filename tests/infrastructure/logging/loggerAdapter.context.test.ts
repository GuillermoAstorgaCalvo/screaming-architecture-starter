/**
 * LoggerAdapter Context Formatting Tests
 */

import type { LogContext } from '@core/ports/LoggerPort';
import { LoggerAdapter } from '@infra/logging/loggerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('LoggerAdapter - Context Formatting - Basic', () => {
	let adapter: LoggerAdapter;
	let consoleSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		globalThis.console ??= originalConsole;
		adapter = new LoggerAdapter('debug');
		consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleSpy?.mockRestore();
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should format context with simple values', () => {
		const context: LogContext = {
			string: 'value',
			number: 42,
			boolean: true,
			null: null,
		};

		adapter.debug('message', context);

		const callArg = consoleSpy.mock.calls[0]?.[0];
		expect(callArg).toContain('message');
		expect(callArg).toContain('"string": "value"');
		expect(callArg).toContain('"number": 42');
		expect(callArg).toContain('"boolean": true');
		expect(callArg).toContain('"null": null');
	});

	it('should format context with nested objects', () => {
		const context: LogContext = {
			user: {
				id: '123',
				name: 'John',
			},
			metadata: {
				timestamp: '2024-01-01',
			},
		};

		adapter.debug('message', context);

		const callArg = consoleSpy.mock.calls[0]?.[0];
		expect(callArg).toContain('message');
		expect(callArg).toContain('"user"');
		expect(callArg).toContain('"id": "123"');
		expect(callArg).toContain('"name": "John"');
	});

	it('should format context with arrays', () => {
		const context: LogContext = {
			tags: ['tag1', 'tag2', 'tag3'],
			numbers: [1, 2, 3],
		};

		adapter.debug('message', context);

		const callArg = consoleSpy.mock.calls[0]?.[0];
		expect(callArg).toContain('message');
		expect(callArg).toContain('"tags"');
		expect(callArg).toContain('"tag1"');
	});
});

describe('LoggerAdapter - Context Formatting - Edge Cases', () => {
	let adapter: LoggerAdapter;
	let consoleSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		globalThis.console ??= originalConsole;
		adapter = new LoggerAdapter('debug');
		consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleSpy?.mockRestore();
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should handle empty context object', () => {
		const context: LogContext = {};

		adapter.debug('message', context);

		// Empty context should not add context string
		expect(consoleSpy).toHaveBeenCalledWith('message');
	});

	it('should handle circular reference in context gracefully', () => {
		const context: LogContext = {
			key: 'value',
		};

		// Create circular reference (intentionally for test)
		(context as Record<string, unknown>).circular = context;

		adapter.debug('message', context);

		// Should fallback to error message instead of throwing
		const callArg = consoleSpy.mock.calls[0]?.[0];
		expect(callArg).toContain('message');
		expect(callArg).toContain('[Unable to stringify context]');
	});

	it('should handle undefined context', () => {
		adapter.debug('message');

		expect(consoleSpy).toHaveBeenCalledWith('message');
	});
});
