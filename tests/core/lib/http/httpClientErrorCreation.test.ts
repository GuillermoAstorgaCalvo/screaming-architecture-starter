import { createHttpError } from '@core/lib/http/httpClientErrorCreation';
import type { HttpClientError } from '@core/ports/HttpPort';
import { describe, expect, it } from 'vitest';

const INTERNAL_SERVER_ERROR = 'Internal Server Error';
const BAD_REQUEST = 'Bad Request';

function describeStatusCodes() {
	describe('status codes', () => {
		it('creates error with status and statusText', () => {
			const response = new Response(null, {
				status: 404,
				statusText: 'Not Found',
			});
			const data = { message: 'Resource not found' };
			const error = createHttpError(response, data);
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('HTTP 404: Not Found');
			expect(error.status).toBe(404);
			expect(error.data).toBe(data);
			expect(error.response).toBe(response);
		});

		it('creates error with 500 status', () => {
			const response = new Response(null, {
				status: 500,
				statusText: INTERNAL_SERVER_ERROR,
			});
			const data = { error: 'Server error' };
			const error = createHttpError(response, data);
			expect(error.message).toBe(`HTTP 500: ${INTERNAL_SERVER_ERROR}`);
			expect(error.status).toBe(500);
			expect(error.data).toBe(data);
		});

		it('creates error with 400 status', () => {
			const response = new Response(null, {
				status: 400,
				statusText: BAD_REQUEST,
			});
			const data = { errors: ['Invalid input'] };
			const error = createHttpError(response, data);
			expect(error.message).toBe(`HTTP 400: ${BAD_REQUEST}`);
			expect(error.status).toBe(400);
			expect(error.data).toBe(data);
		});
	});
}

function describeDataHandling() {
	describe('data handling', () => {
		it('handles null data', () => {
			const response = new Response(null, {
				status: 404,
				statusText: 'Not Found',
			});
			const error = createHttpError(response, null);
			expect(error.status).toBe(404);
			expect(error.data).toBeNull();
		});

		it('handles undefined data', () => {
			const response = new Response(null, {
				status: 404,
				statusText: 'Not Found',
			});
			const error = createHttpError(response, undefined);
			expect(error.status).toBe(404);
			expect(error.data).toBeUndefined();
		});

		it('handles string data', () => {
			const response = new Response(null, {
				status: 400,
				statusText: BAD_REQUEST,
			});
			const error = createHttpError(response, 'Error message');
			expect(error.data).toBe('Error message');
		});

		it('handles array data', () => {
			const response = new Response(null, {
				status: 422,
				statusText: 'Unprocessable Entity',
			});
			const data = ['Error 1', 'Error 2'];
			const error = createHttpError(response, data);
			expect(error.data).toBe(data);
		});
	});
}

function describeObjectProperties() {
	describe('object properties', () => {
		it('preserves response object reference', () => {
			const response = new Response(null, {
				status: 404,
				statusText: 'Not Found',
			});
			const error = createHttpError(response, null);
			expect(error.response).toBe(response);
		});

		it('creates error that is instance of HttpClientError', () => {
			const response = new Response(null, {
				status: 500,
				statusText: INTERNAL_SERVER_ERROR,
			});
			const error = createHttpError(response, null);
			expect(error).toBeInstanceOf(Error);
			// Type assertion check
			const httpError: HttpClientError = error;
			expect(httpError.status).toBe(500);
		});

		it('creates error with all required HttpClientError properties', () => {
			const response = new Response(null, {
				status: 403,
				statusText: 'Forbidden',
			});
			const data = { reason: 'Access denied' };
			const error = createHttpError(response, data);
			expect(error).toHaveProperty('status');
			expect(error).toHaveProperty('data');
			expect(error).toHaveProperty('response');
			expect(error).toHaveProperty('message');
			expect(error).toHaveProperty('name');
		});
	});
}

function describeEdgeCases() {
	describe('edge cases', () => {
		it('handles empty statusText', () => {
			const response = new Response(null, {
				status: 200,
				statusText: '',
			});
			const error = createHttpError(response, null);
			expect(error.message).toBe('HTTP 200: ');
		});

		it('handles complex data object', () => {
			const response = new Response(null, {
				status: 400,
				statusText: BAD_REQUEST,
			});
			const data = {
				errors: [
					{ field: 'email', message: 'Invalid email' },
					{ field: 'password', message: 'Too short' },
				],
				meta: { timestamp: Date.now() },
			};
			const error = createHttpError(response, data);
			expect(error.data).toEqual(data);
		});

		it('handles number data', () => {
			const response = new Response(null, {
				status: 500,
				statusText: INTERNAL_SERVER_ERROR,
			});
			const error = createHttpError(response, 12345);
			expect(error.data).toBe(12345);
		});

		it('handles boolean data', () => {
			const response = new Response(null, {
				status: 400,
				statusText: BAD_REQUEST,
			});
			const error = createHttpError(response, true);
			expect(error.data).toBe(true);
		});
	});
}

describe('httpClientErrorCreation', () => {
	describe('createHttpError', () => {
		describeStatusCodes();
		describeDataHandling();
		describeObjectProperties();
		describeEdgeCases();
	});
});
