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
