import { logCookieWarn } from '@infra/storage/cookieStorageAdapter.logging';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('cookieStorageAdapter.logging', () => {
	let originalConsole: Console;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		originalConsole = globalThis.console;
		consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleWarnSpy.mockRestore();
		globalThis.console = originalConsole;
		vi.restoreAllMocks();
	});

	describe('logCookieWarn', () => {
		const TEST_WARNING_MESSAGE = 'Test warning message';
		const TEST_WARNING = 'Test warning';

		it('should log warning message without context', () => {
			logCookieWarn(TEST_WARNING_MESSAGE);

			expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
			expect(consoleWarnSpy).toHaveBeenCalledWith(TEST_WARNING_MESSAGE);
		});

		it('should log warning message with context', () => {
			const context = { error: 'Test error', key: 'test-key' };
			logCookieWarn(TEST_WARNING_MESSAGE, context);

			expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
			expect(consoleWarnSpy).toHaveBeenCalledWith(TEST_WARNING_MESSAGE, context);
		});

		it('should handle empty context object', () => {
			logCookieWarn(TEST_WARNING, {});

			expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
			expect(consoleWarnSpy).toHaveBeenCalledWith(TEST_WARNING, {});
		});

		it('should handle undefined context', () => {
			logCookieWarn(TEST_WARNING);

			expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
			expect(consoleWarnSpy).toHaveBeenCalledWith(TEST_WARNING);
		});

		it('should handle when console is undefined (SSR safety)', () => {
			// @ts-expect-error - Intentionally removing console for SSR test
			delete globalThis.console;

			// Should not throw
			expect(() => {
				logCookieWarn(TEST_WARNING);
			}).not.toThrow();
		});

		it('should handle complex context objects', () => {
			const complexContext = {
				error: new Error('Test error'),
				nested: {
					key: 'value',
					array: [1, 2, 3],
				},
				number: 42,
				boolean: true,
			};

			logCookieWarn(TEST_WARNING, complexContext);

			expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
			expect(consoleWarnSpy).toHaveBeenCalledWith(TEST_WARNING, complexContext);
		});
	});
});
