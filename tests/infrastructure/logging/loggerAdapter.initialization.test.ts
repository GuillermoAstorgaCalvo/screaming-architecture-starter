/**
 * LoggerAdapter Initialization Tests
 */

import { env } from '@core/config/env.client';
import { LoggerAdapter } from '@infra/logging/loggerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const DEBUG_MESSAGE = 'debug message';
const ERROR_MESSAGE = 'error message';
const INFO_MESSAGE = 'info message';
const WARN_MESSAGE = 'warn message';

describe('LoggerAdapter - Initialization', () => {
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

	it('should initialize with default minLevel based on environment (production)', () => {
		env.PROD = true;
		const adapter = new LoggerAdapter();

		// In production, minLevel should be 'warn'
		// We can't directly access private minLevel, so we test behavior
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

		adapter.debug(DEBUG_MESSAGE);
		adapter.warn(WARN_MESSAGE);

		expect(consoleDebugSpy).not.toHaveBeenCalled();
		expect(consoleWarnSpy).toHaveBeenCalledWith(WARN_MESSAGE);

		consoleWarnSpy.mockRestore();
		consoleDebugSpy.mockRestore();
	});

	it('should initialize with default minLevel based on environment (development)', () => {
		env.PROD = false;
		const adapter = new LoggerAdapter();

		// In development, minLevel should be 'debug'
		const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

		adapter.debug(DEBUG_MESSAGE);

		expect(consoleDebugSpy).toHaveBeenCalledWith(DEBUG_MESSAGE);

		consoleDebugSpy.mockRestore();
	});

	it('should initialize with custom minLevel', () => {
		const adapter = new LoggerAdapter('info');

		const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
		const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

		adapter.debug(DEBUG_MESSAGE);
		adapter.info(INFO_MESSAGE);

		expect(consoleDebugSpy).not.toHaveBeenCalled();
		expect(consoleInfoSpy).toHaveBeenCalledWith(INFO_MESSAGE);

		consoleInfoSpy.mockRestore();
		consoleDebugSpy.mockRestore();
	});

	it('should handle SSR environment (console undefined)', () => {
		// Mock SSR environment where console is undefined
		// @ts-expect-error - Intentionally setting console to undefined for SSR test
		globalThis.console = undefined;

		const adapter = new LoggerAdapter();

		// Should not throw when logging
		expect(() => {
			adapter.debug(DEBUG_MESSAGE);
			adapter.info(INFO_MESSAGE);
			adapter.warn(WARN_MESSAGE);
			adapter.error(ERROR_MESSAGE);
		}).not.toThrow();
	});
});
