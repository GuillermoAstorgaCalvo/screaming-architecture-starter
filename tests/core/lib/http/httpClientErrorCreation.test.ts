import { createHttpError } from '@core/lib/http/httpClientErrorCreation';
import type { HttpClientError } from '@core/ports/HttpPort';
import { describe, expect, it } from 'vitest';

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
				statusText: 'Internal Server Error',
			});
			const data = { error: 'Server error' };
			const error = createHttpError(response, data);
			expect(error.message).toBe('HTTP 500: Internal Server Error');
			expect(error.status).toBe(500);
			expect(error.data).toBe(data);
		});

		it('creates error with 400 status', () => {
			const response = new Response(null, {
				status: 400,
				statusText: 'Bad Request',
			});
			const data = { errors: ['Invalid input'] };
			const error = createHttpError(response, data);
			expect(error.message).toBe('HTTP 400: Bad Request');
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
				statusText: 'Bad Request',
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
				statusText: 'Internal Server Error',
			});
			const error = createHttpError(response, null);
			expect(error).toBeInstanceOf(Error);
			// Type assertion check
			const httpError: HttpClientError = error;
			expect(httpError.status).toBe(500);
		});
	});
}

describe('httpClientErrorCreation', () => {
	describe('createHttpError', () => {
		describeStatusCodes();
		describeDataHandling();
		describeObjectProperties();
	});
});
