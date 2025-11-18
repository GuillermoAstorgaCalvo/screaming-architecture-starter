import { handleHttpError } from '@core/lib/http/httpClientErrorHandler';
import type { ErrorInterceptor } from '@core/lib/http/httpClientInterceptors';
import type { HttpClientError } from '@core/ports/HttpPort';
import { describe, expect, it, vi } from 'vitest';

// Mock i18n
vi.mock('@core/i18n/i18n', () => ({
	default: {
		t: (key: string) => {
			if (key === 'errors.requestTimeout') {
				return 'Request timeout';
			}
			return key;
		},
	},
}));

// Helper function to execute and catch error
async function executeAndCatchError(
	error: unknown,
	errorInterceptors: ErrorInterceptor[]
): Promise<unknown> {
	try {
		await handleHttpError(error, errorInterceptors);
		throw new Error('Expected error to be thrown');
	} catch (caughtError) {
		return caughtError;
	}
}

// Helper function to create mock interceptors
function createMockInterceptors(count: number): ErrorInterceptor[] {
	return Array.from({ length: count }, () =>
		vi.fn().mockImplementation((err: HttpClientError) => {
			throw err;
		})
	);
}

const DESCRIBE_SUITE_NAME = 'httpClientErrorHandler - handleHttpError';

describe(DESCRIBE_SUITE_NAME, () => {
	describe('AbortError handling', () => {
		it('handles AbortError (timeout) and creates TimeoutError', async () => {
			const abortError = new DOMException('Aborted', 'AbortError');
			const errorInterceptors: ErrorInterceptor[] = [];
			await expect(handleHttpError(abortError, errorInterceptors)).rejects.toThrow();
			const httpError = (await executeAndCatchError(
				abortError,
				errorInterceptors
			)) as HttpClientError;
			expect(httpError.name).toBe('TimeoutError');
			expect(httpError.message).toBe('Request timeout');
		});
	});
});

describe(DESCRIBE_SUITE_NAME, () => {
	describe('HttpClientError handling', () => {
		it('handles HttpClientError with status', async () => {
			const httpError: HttpClientError = {
				...new Error('HTTP 404: Not Found'),
				status: 404,
				data: { message: 'Not found' },
			};
			const errorInterceptors: ErrorInterceptor[] = [];
			await expect(handleHttpError(httpError, errorInterceptors)).rejects.toThrow();
			const caughtError = (await executeAndCatchError(
				httpError,
				errorInterceptors
			)) as HttpClientError;
			expect(caughtError.status).toBe(404);
			expect(caughtError.data).toEqual({ message: 'Not found' });
		});

		it('handles object with status property as HttpClientError', async () => {
			const error = {
				status: 403,
				message: 'Forbidden',
			};
			const errorInterceptors: ErrorInterceptor[] = [];
			await expect(handleHttpError(error, errorInterceptors)).rejects.toThrow();
			const httpError = (await executeAndCatchError(error, errorInterceptors)) as HttpClientError;
			expect(httpError.status).toBe(403);
		});
	});
});

describe(DESCRIBE_SUITE_NAME, () => {
	describe('Error instance handling', () => {
		it('handles Error instance', async () => {
			const error = new Error('Generic error');
			const errorInterceptors: ErrorInterceptor[] = [];
			await expect(handleHttpError(error, errorInterceptors)).rejects.toThrow();
			const caughtError = (await executeAndCatchError(error, errorInterceptors)) as Error;
			expect(caughtError).toBeInstanceOf(Error);
			expect(caughtError.message).toBe('Generic error');
		});
	});
});

describe(DESCRIBE_SUITE_NAME, () => {
	describe('non-Error value conversion', () => {
		it('handles non-Error values by converting to Error', async () => {
			const error = 'String error';
			const errorInterceptors: ErrorInterceptor[] = [];
			await expect(handleHttpError(error, errorInterceptors)).rejects.toThrow();
			const caughtError = (await executeAndCatchError(error, errorInterceptors)) as Error;
			expect(caughtError).toBeInstanceOf(Error);
			expect(caughtError.message).toBe('String error');
		});

		it('handles number as error', async () => {
			const error = 500;
			const errorInterceptors: ErrorInterceptor[] = [];
			await expect(handleHttpError(error, errorInterceptors)).rejects.toThrow();
			const caughtError = (await executeAndCatchError(error, errorInterceptors)) as Error;
			expect(caughtError).toBeInstanceOf(Error);
			expect(caughtError.message).toBe('500');
		});

		it('handles null error', async () => {
			const error = null;
			const errorInterceptors: ErrorInterceptor[] = [];
			await expect(handleHttpError(error, errorInterceptors)).rejects.toThrow();
			const caughtError = (await executeAndCatchError(error, errorInterceptors)) as Error;
			expect(caughtError).toBeInstanceOf(Error);
			expect(caughtError.message).toBe('null');
		});
	});
});

describe(DESCRIBE_SUITE_NAME, () => {
	describe('error interceptors', () => {
		it('executes error interceptors', async () => {
			const error = new Error('Test error');
			const interceptors = createMockInterceptors(2);
			const errorInterceptors: ErrorInterceptor[] = interceptors;
			await expect(handleHttpError(error, errorInterceptors)).rejects.toThrow();
			expect(interceptors[0]).toHaveBeenCalledTimes(1);
			expect(interceptors[1]).toHaveBeenCalledTimes(1);
		});
	});
});
