import {
	isBinaryBody,
	isPrimitiveBody,
	prepareRequestBody,
	serializeBody,
} from '@core/lib/http/httpClientBody';
import { describe, expect, it } from 'vitest';

const CONTENT_TYPE_JSON = 'application/json';
const CONTENT_TYPE_HEADER = 'Content-Type';
const BEARER_TOKEN = 'Bearer token';

describe('isBinaryBody', () => {
	it('returns true for FormData', () => {
		const formData = new FormData();
		expect(isBinaryBody(formData)).toBe(true);
	});

	it('returns true for Blob', () => {
		const blob = new Blob(['test'], { type: 'text/plain' });
		expect(isBinaryBody(blob)).toBe(true);
	});

	it('returns true for ArrayBuffer', () => {
		const arrayBuffer = new ArrayBuffer(8);
		expect(isBinaryBody(arrayBuffer)).toBe(true);
	});

	it('returns true for ReadableStream', () => {
		const stream = new ReadableStream();
		expect(isBinaryBody(stream)).toBe(true);
	});

	it('returns false for string', () => {
		expect(isBinaryBody('test')).toBe(false);
	});

	it('returns false for object', () => {
		expect(isBinaryBody({ key: 'value' })).toBe(false);
	});

	it('returns false for null', () => {
		expect(isBinaryBody(null)).toBe(false);
	});

	it('returns false for undefined', () => {
		expect(isBinaryBody(undefined)).toBe(false);
	});
});

describe('isPrimitiveBody', () => {
	it('returns true for string', () => {
		expect(isPrimitiveBody('test')).toBe(true);
	});

	it('returns true for number', () => {
		expect(isPrimitiveBody(123)).toBe(true);
	});

	it('returns true for boolean', () => {
		expect(isPrimitiveBody(true)).toBe(true);
		expect(isPrimitiveBody(false)).toBe(true);
	});

	it('returns false for object', () => {
		expect(isPrimitiveBody({ key: 'value' })).toBe(false);
	});

	it('returns false for null', () => {
		expect(isPrimitiveBody(null)).toBe(false);
	});

	it('returns false for undefined', () => {
		expect(isPrimitiveBody(undefined)).toBe(false);
	});

	it('returns false for array', () => {
		expect(isPrimitiveBody([1, 2, 3])).toBe(false);
	});
});

describe('serializeBody', () => {
	it('returns empty string for null', () => {
		expect(serializeBody(null)).toBe('');
	});

	it('returns empty string for undefined', () => {
		expect(serializeBody(undefined)).toBe('');
	});

	it('returns binary body as-is for FormData', () => {
		const formData = new FormData();
		formData.append('key', 'value');
		const result = serializeBody(formData);
		expect(result).toBe(formData);
		expect(result instanceof FormData).toBe(true);
	});

	it('returns binary body as-is for Blob', () => {
		const blob = new Blob(['test'], { type: 'text/plain' });
		const result = serializeBody(blob);
		expect(result).toBe(blob);
	});

	it('returns binary body as-is for ArrayBuffer', () => {
		const arrayBuffer = new ArrayBuffer(8);
		const result = serializeBody(arrayBuffer);
		expect(result).toBe(arrayBuffer);
	});

	it('returns binary body as-is for ReadableStream', () => {
		const stream = new ReadableStream();
		const result = serializeBody(stream);
		expect(result).toBe(stream);
	});

	it('serializes object to JSON string', () => {
		const obj = { key: 'value', number: 123 };
		const result = serializeBody(obj);
		expect(result).toBe(JSON.stringify(obj));
	});

	it('serializes array to JSON string', () => {
		const arr = [1, 2, 3];
		const result = serializeBody(arr);
		expect(result).toBe(JSON.stringify(arr));
	});

	it('converts string to string', () => {
		expect(serializeBody('test')).toBe('test');
	});

	it('converts number to string', () => {
		expect(serializeBody(123)).toBe('123');
	});

	it('converts boolean to string', () => {
		expect(serializeBody(true)).toBe('true');
		expect(serializeBody(false)).toBe('false');
	});
});

describe('prepareRequestBody', () => {
	it('returns headers and no body for undefined', () => {
		const result = prepareRequestBody(undefined, { [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON });
		expect(result.body).toBeUndefined();
		expect(result.headers.get(CONTENT_TYPE_HEADER)).toBe(CONTENT_TYPE_JSON);
	});

	it('serializes object body and sets Content-Type', () => {
		const body = { key: 'value' };
		const result = prepareRequestBody(body, { [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON });
		expect(result.body).toBe(JSON.stringify(body));
		expect(result.headers.get(CONTENT_TYPE_HEADER)).toBe(CONTENT_TYPE_JSON);
	});

	it('removes Content-Type header for FormData', () => {
		const formData = new FormData();
		formData.append('key', 'value');
		const result = prepareRequestBody(formData, { [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON });
		expect(result.body).toBe(formData);
		expect(result.headers.has(CONTENT_TYPE_HEADER)).toBe(false);
	});

	it('preserves other headers when removing Content-Type for FormData', () => {
		const formData = new FormData();
		formData.append('key', 'value');
		const result = prepareRequestBody(formData, {
			[CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON,
			Authorization: BEARER_TOKEN,
		});
		expect(result.body).toBe(formData);
		expect(result.headers.has(CONTENT_TYPE_HEADER)).toBe(false);
		expect(result.headers.get('Authorization')).toBe(BEARER_TOKEN);
	});

	it('converts Record headers to Headers', () => {
		const body = { key: 'value' };
		const headers = { [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON, Authorization: BEARER_TOKEN };
		const result = prepareRequestBody(body, headers);
		expect(result.headers).toBeInstanceOf(Headers);
		expect(result.headers.get(CONTENT_TYPE_HEADER)).toBe(CONTENT_TYPE_JSON);
		expect(result.headers.get('Authorization')).toBe(BEARER_TOKEN);
	});

	it('preserves existing Headers object', () => {
		const body = { key: 'value' };
		const headers = new Headers({ [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON });
		const result = prepareRequestBody(body, headers);
		expect(result.headers).toBeInstanceOf(Headers);
		expect(result.headers.get(CONTENT_TYPE_HEADER)).toBe(CONTENT_TYPE_JSON);
	});

	it('handles empty headers', () => {
		const body = { key: 'value' };
		const result = prepareRequestBody(body, undefined);
		expect(result.body).toBe(JSON.stringify(body));
		expect(result.headers).toBeInstanceOf(Headers);
	});
});
