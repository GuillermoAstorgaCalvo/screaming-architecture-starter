import {
	getHttpStatusCategory,
	type HttpMethod,
	type HttpStatusCode,
	isClientError,
	isServerError,
	isSuccessStatus,
} from '@src-types/http';
import { describe, expect, it } from 'vitest';

describe('http types', () => {
	describe('HttpMethod', () => {
		it('should accept all HTTP methods', () => {
			const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
			expect(methods).toHaveLength(7);
		});

		it('should accept GET method', () => {
			const method: HttpMethod = 'GET';
			expect(method).toBe('GET');
		});

		it('should accept POST method', () => {
			const method: HttpMethod = 'POST';
			expect(method).toBe('POST');
		});
	});

	describe('HttpStatusCode', () => {
		it('should accept success status codes', () => {
			const codes: HttpStatusCode[] = [200, 201, 204];
			expect(codes).toHaveLength(3);
		});

		it('should accept client error status codes', () => {
			const codes: HttpStatusCode[] = [400, 401, 403, 404, 409, 422, 429];
			expect(codes).toHaveLength(7);
		});

		it('should accept server error status codes', () => {
			const codes: HttpStatusCode[] = [500, 502, 503, 504];
			expect(codes).toHaveLength(4);
		});
	});

	describe('getHttpStatusCategory', () => {
		it('should return success for 2xx status codes', () => {
			expect(getHttpStatusCategory(200)).toBe('success');
			expect(getHttpStatusCategory(201)).toBe('success');
			expect(getHttpStatusCategory(204)).toBe('success');
			expect(getHttpStatusCategory(299)).toBe('success');
		});

		it('should return clientError for 4xx status codes', () => {
			expect(getHttpStatusCategory(400)).toBe('clientError');
			expect(getHttpStatusCategory(401)).toBe('clientError');
			expect(getHttpStatusCategory(403)).toBe('clientError');
			expect(getHttpStatusCategory(404)).toBe('clientError');
			expect(getHttpStatusCategory(499)).toBe('clientError');
		});

		it('should return serverError for 5xx status codes', () => {
			expect(getHttpStatusCategory(500)).toBe('serverError');
			expect(getHttpStatusCategory(502)).toBe('serverError');
			expect(getHttpStatusCategory(503)).toBe('serverError');
			expect(getHttpStatusCategory(504)).toBe('serverError');
			expect(getHttpStatusCategory(599)).toBe('serverError');
		});

		it('should return unknown for other status codes', () => {
			expect(getHttpStatusCategory(100)).toBe('unknown');
			expect(getHttpStatusCategory(300)).toBe('unknown');
			expect(getHttpStatusCategory(600)).toBe('unknown');
		});
	});

	describe('isSuccessStatus', () => {
		it('should return true for 2xx status codes', () => {
			expect(isSuccessStatus(200)).toBe(true);
			expect(isSuccessStatus(201)).toBe(true);
			expect(isSuccessStatus(204)).toBe(true);
			expect(isSuccessStatus(299)).toBe(true);
		});

		it('should return false for non-2xx status codes', () => {
			expect(isSuccessStatus(199)).toBe(false);
			expect(isSuccessStatus(300)).toBe(false);
			expect(isSuccessStatus(400)).toBe(false);
			expect(isSuccessStatus(500)).toBe(false);
		});
	});

	describe('isClientError', () => {
		it('should return true for 4xx status codes', () => {
			expect(isClientError(400)).toBe(true);
			expect(isClientError(401)).toBe(true);
			expect(isClientError(403)).toBe(true);
			expect(isClientError(404)).toBe(true);
			expect(isClientError(499)).toBe(true);
		});

		it('should return false for non-4xx status codes', () => {
			expect(isClientError(200)).toBe(false);
			expect(isClientError(300)).toBe(false);
			expect(isClientError(399)).toBe(false);
			expect(isClientError(500)).toBe(false);
		});
	});

	describe('isServerError', () => {
		it('should return true for 5xx status codes', () => {
			expect(isServerError(500)).toBe(true);
			expect(isServerError(502)).toBe(true);
			expect(isServerError(503)).toBe(true);
			expect(isServerError(504)).toBe(true);
			expect(isServerError(599)).toBe(true);
		});

		it('should return false for non-5xx status codes', () => {
			expect(isServerError(200)).toBe(false);
			expect(isServerError(400)).toBe(false);
			expect(isServerError(499)).toBe(false);
			expect(isServerError(600)).toBe(false);
		});
	});
});
