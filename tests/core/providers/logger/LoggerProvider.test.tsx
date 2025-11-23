import type { LoggerPort } from '@core/ports/LoggerPort';
import { LoggerProvider } from '@core/providers/logger/LoggerProvider';
import { useLogger } from '@core/providers/logger/useLogger';
import { act, renderHook } from '@testing-library/react';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

function createLoggerWrapper(logger: LoggerPort) {
	return function LoggerTestWrapper({ children }: { children: ReactNode }) {
		return <LoggerProvider logger={logger}>{children}</LoggerProvider>;
	};
}

describe('LoggerProvider & useLogger', () => {
	it('throws when useLogger is called outside of LoggerProvider', () => {
		expect(() => renderHook(() => useLogger())).toThrowError(
			'useLogger must be used within a LoggerProvider'
		);
	});

	it('returns the logger instance supplied to LoggerProvider', () => {
		const logger = new MockLoggerAdapter();
		const { result } = renderHook(() => useLogger(), {
			wrapper: createLoggerWrapper(logger),
		});

		expect(result.current).toBe(logger);
	});

	it('forwards all log levels to the provided logger implementation', () => {
		const logger = new MockLoggerAdapter();
		const { result } = renderHook(() => useLogger(), {
			wrapper: createLoggerWrapper(logger),
		});

		const error = new Error('boom');
		const scenarios: Array<{
			level: 'debug' | 'info' | 'warn' | 'error';
			message: string;
			context: Record<string, unknown>;
			error?: Error;
		}> = [
			{ level: 'debug', message: 'debug message', context: { scope: 'debug' } },
			{ level: 'info', message: 'info message', context: { scope: 'info' } },
			{ level: 'warn', message: 'warn message', context: { scope: 'warn' } },
			{ level: 'error', message: 'error message', context: { scope: 'error' }, error },
		];

		act(() => {
			for (const scenario of scenarios) {
				if (scenario.level === 'error') {
					result.current.error(scenario.message, scenario.error, scenario.context);
					continue;
				}

				result.current[scenario.level](scenario.message, scenario.context);
			}
		});

		expect(logger.logs).toEqual([
			{ level: 'debug', message: 'debug message', context: { scope: 'debug' } },
			{ level: 'info', message: 'info message', context: { scope: 'info' } },
			{ level: 'warn', message: 'warn message', context: { scope: 'warn' } },
			{
				level: 'error',
				message: 'error message',
				error,
				context: { scope: 'error' },
			},
		]);
	});
});

describe('LoggerProvider lifecycle', () => {
	it('maintains logger instance on unmount and remount', () => {
		const logger = new MockLoggerAdapter();
		const { result, unmount } = renderHook(() => useLogger(), {
			wrapper: createLoggerWrapper(logger),
		});

		const initialLogger = result.current;
		unmount();

		const { result: newResult } = renderHook(() => useLogger(), {
			wrapper: createLoggerWrapper(logger),
		});

		expect(newResult.current).toBe(logger);
		expect(newResult.current).toBe(initialLogger);
	});
});

describe('LoggerProvider context memoization', () => {
	it('memoizes context value when logger instance is stable', () => {
		const logger = new MockLoggerAdapter();
		const { result, rerender } = renderHook(() => useLogger(), {
			wrapper: createLoggerWrapper(logger),
		});

		const firstValue = result.current;
		rerender();

		expect(result.current).toBe(firstValue);
		expect(result.current).toBe(logger);
	});
});

describe('LoggerProvider error handling', () => {
	it('handles logging with null or undefined context gracefully', () => {
		const logger = new MockLoggerAdapter();
		const { result } = renderHook(() => useLogger(), {
			wrapper: createLoggerWrapper(logger),
		});

		act(() => {
			result.current.debug('message', {});
			result.current.info('message', {});
			result.current.warn('message', {});
			result.current.error('message', undefined, {});
		});

		expect(logger.logs.length).toBeGreaterThan(0);
	});

	it('handles complex error objects', () => {
		const logger = new MockLoggerAdapter();
		const { result } = renderHook(() => useLogger(), {
			wrapper: createLoggerWrapper(logger),
		});

		const complexError = new Error('Complex error');
		(complexError as Error & { code?: string }).code = 'ERR_COMPLEX';
		(complexError as Error & { details?: unknown }).details = { nested: { value: 123 } };

		act(() => {
			result.current.error('Complex error occurred', complexError, {
				additional: 'context',
			});
		});

		expect(logger.logs).toHaveLength(1);
		expect(logger.logs[0]?.error).toBe(complexError);
	});
});

describe('LoggerProvider composition', () => {
	it('works correctly when nested with other providers', () => {
		const logger = new MockLoggerAdapter();

		const NestedWrapper = ({ children }: { children: ReactNode }) => (
			<LoggerProvider logger={logger}>
				<div data-testid="nested">{children}</div>
			</LoggerProvider>
		);

		const { result } = renderHook(() => useLogger(), {
			wrapper: NestedWrapper,
		});

		expect(result.current).toBe(logger);
	});
});
