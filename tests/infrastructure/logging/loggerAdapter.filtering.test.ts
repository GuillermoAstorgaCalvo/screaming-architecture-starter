/**
 * LoggerAdapter Min Level Filtering Tests
 */

import { LoggerAdapter } from '@infra/logging/loggerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('LoggerAdapter - Min Level Filtering - Debug', () => {
	let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
	let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		globalThis.console ??= originalConsole;
		consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
		consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
		consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleDebugSpy?.mockRestore();
		consoleInfoSpy?.mockRestore();
		consoleWarnSpy?.mockRestore();
		consoleErrorSpy?.mockRestore();
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should log all levels when minLevel is debug', () => {
		const adapter = new LoggerAdapter('debug');

		adapter.debug('debug');
		adapter.info('info');
		adapter.warn('warn');
		adapter.error('error');

		expect(consoleDebugSpy).toHaveBeenCalled();
		expect(consoleInfoSpy).toHaveBeenCalled();
		expect(consoleWarnSpy).toHaveBeenCalled();
		expect(consoleErrorSpy).toHaveBeenCalled();
	});
});

describe('LoggerAdapter - Min Level Filtering - Info', () => {
	let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
	let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		globalThis.console ??= originalConsole;
		consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
		consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
		consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleDebugSpy?.mockRestore();
		consoleInfoSpy?.mockRestore();
		consoleWarnSpy?.mockRestore();
		consoleErrorSpy?.mockRestore();
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should log info, warn, and error when minLevel is info', () => {
		const adapter = new LoggerAdapter('info');

		adapter.debug('debug');
		adapter.info('info');
		adapter.warn('warn');
		adapter.error('error');

		expect(consoleDebugSpy).not.toHaveBeenCalled();
		expect(consoleInfoSpy).toHaveBeenCalled();
		expect(consoleWarnSpy).toHaveBeenCalled();
		expect(consoleErrorSpy).toHaveBeenCalled();
	});
});

describe('LoggerAdapter - Min Level Filtering - Warn', () => {
	let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
	let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		globalThis.console ??= originalConsole;
		consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
		consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
		consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleDebugSpy?.mockRestore();
		consoleInfoSpy?.mockRestore();
		consoleWarnSpy?.mockRestore();
		consoleErrorSpy?.mockRestore();
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should log warn and error when minLevel is warn', () => {
		const adapter = new LoggerAdapter('warn');

		adapter.debug('debug');
		adapter.info('info');
		adapter.warn('warn');
		adapter.error('error');

		expect(consoleDebugSpy).not.toHaveBeenCalled();
		expect(consoleInfoSpy).not.toHaveBeenCalled();
		expect(consoleWarnSpy).toHaveBeenCalled();
		expect(consoleErrorSpy).toHaveBeenCalled();
	});
});

describe('LoggerAdapter - Min Level Filtering - Error', () => {
	let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
	let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
	let originalConsole: typeof console;

	beforeEach(() => {
		originalConsole = globalThis.console;
		globalThis.console ??= originalConsole;
		consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
		consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
		consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleDebugSpy?.mockRestore();
		consoleInfoSpy?.mockRestore();
		consoleWarnSpy?.mockRestore();
		consoleErrorSpy?.mockRestore();
		globalThis.console = originalConsole;
		vi.clearAllMocks();
	});

	it('should log only error when minLevel is error', () => {
		const adapter = new LoggerAdapter('error');

		adapter.debug('debug');
		adapter.info('info');
		adapter.warn('warn');
		adapter.error('error');

		expect(consoleDebugSpy).not.toHaveBeenCalled();
		expect(consoleInfoSpy).not.toHaveBeenCalled();
		expect(consoleWarnSpy).not.toHaveBeenCalled();
		expect(consoleErrorSpy).toHaveBeenCalled();
	});
});
