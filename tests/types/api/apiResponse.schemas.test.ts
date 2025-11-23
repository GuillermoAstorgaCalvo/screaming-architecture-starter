import {
	apiMetadataSchema,
	createApiResponseSchema,
	createApiResponseWithMetaSchema,
	createComposedApiResponseSchema,
} from '@src-types/api/apiResponse.schemas';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

describe('apiResponse schemas', () => {
	describe('apiMetadataSchema', () => {
		it('should validate metadata with string keys', () => {
			const metadata = { key1: 'value1', key2: 42, key3: true };
			const result = apiMetadataSchema.safeParse(metadata);
			expect(result.success).toBe(true);
		});

		it('should validate empty metadata', () => {
			const metadata = {};
			const result = apiMetadataSchema.safeParse(metadata);
			expect(result.success).toBe(true);
		});

		it('should validate metadata with nested objects', () => {
			const metadata = { nested: { key: 'value' } };
			const result = apiMetadataSchema.safeParse(metadata);
			expect(result.success).toBe(true);
		});
	});

	describe('createApiResponseSchema', () => {
		it('should create schema with data', () => {
			const dataSchema = z.string();
			const responseSchema = createApiResponseSchema(dataSchema);
			const response = { data: 'test' };
			const result = responseSchema.safeParse(response);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.data).toBe('test');
			}
		});

		it('should create schema with data and message', () => {
			const dataSchema = z.string();
			const responseSchema = createApiResponseSchema(dataSchema);
			const response = { data: 'test', message: 'Success' };
			const result = responseSchema.safeParse(response);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.data).toBe('test');
				expect(result.data.message).toBe('Success');
			}
		});

		it('should create schema with data and metadata', () => {
			const dataSchema = z.string();
			const responseSchema = createApiResponseSchema(dataSchema);
			const response = { data: 'test', metadata: { key: 'value' } };
			const result = responseSchema.safeParse(response);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.data).toBe('test');
				expect(result.data.metadata).toEqual({ key: 'value' });
			}
		});

		it('should reject invalid data type', () => {
			const dataSchema = z.string();
			const responseSchema = createApiResponseSchema(dataSchema);
			const response = { data: 123 };
			const result = responseSchema.safeParse(response);
			expect(result.success).toBe(false);
		});

		it('should reject extra properties (strict mode)', () => {
			const dataSchema = z.string();
			const responseSchema = createApiResponseSchema(dataSchema);
			const response = { data: 'test', extra: 'property' };
			const result = responseSchema.safeParse(response);
			expect(result.success).toBe(false);
		});

		it('should work with object data schema', () => {
			const dataSchema = z.object({ id: z.string(), name: z.string() });
			const responseSchema = createApiResponseSchema(dataSchema);
			const response = { data: { id: '1', name: 'Test' } };
			const result = responseSchema.safeParse(response);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.data.id).toBe('1');
				expect(result.data.data.name).toBe('Test');
			}
		});
	});

	describe('createApiResponseWithMetaSchema', () => {
		it('should create schema with HTTP metadata', () => {
			const dataSchema = z.string();
			const responseSchema = createApiResponseWithMetaSchema(dataSchema);
			const response = {
				data: 'test',
				status: 200,
				statusText: 'OK',
				headers: {},
				response: {},
			};
			const result = responseSchema.safeParse(response);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.data).toBe('test');
				expect(result.data.status).toBe(200);
				expect(result.data.statusText).toBe('OK');
			}
		});

		it('should create schema with API metadata', () => {
			const dataSchema = z.string();
			const responseSchema = createApiResponseWithMetaSchema(dataSchema);
			const response = {
				data: 'test',
				status: 200,
				statusText: 'OK',
				headers: {},
				response: {},
				apiMeta: {
					version: '1.0',
					requestId: 'req-123',
					timestamp: '2023-01-01T00:00:00Z',
				},
			};
			const result = responseSchema.safeParse(response);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.apiMeta?.version).toBe('1.0');
				expect(result.data.apiMeta?.requestId).toBe('req-123');
			}
		});

		it('should reject missing required HTTP fields', () => {
			const dataSchema = z.string();
			const responseSchema = createApiResponseWithMetaSchema(dataSchema);
			const response = { data: 'test' };
			const result = responseSchema.safeParse(response);
			expect(result.success).toBe(false);
		});
	});

	describe('createComposedApiResponseSchema', () => {
		it('should create composed schema with all fields', () => {
			const dataSchema = z.string();
			const responseSchema = createComposedApiResponseSchema(dataSchema);
			const response = {
				data: 'test',
				message: 'Success',
				metadata: { key: 'value' },
				status: 200,
				statusText: 'OK',
				headers: {},
				response: {},
				apiMeta: {
					version: '1.0',
				},
			};
			const result = responseSchema.safeParse(response);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.data).toBe('test');
				expect(result.data.message).toBe('Success');
				expect(result.data.status).toBe(200);
			}
		});

		it('should work with minimal required fields', () => {
			const dataSchema = z.string();
			const responseSchema = createComposedApiResponseSchema(dataSchema);
			const response = {
				data: 'test',
				status: 200,
				statusText: 'OK',
				headers: {},
				response: {},
			};
			const result = responseSchema.safeParse(response);
			expect(result.success).toBe(true);
		});
	});
});
