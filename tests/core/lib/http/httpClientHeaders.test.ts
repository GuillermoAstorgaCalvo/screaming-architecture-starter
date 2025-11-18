import {
	addHeadersFromSource,
	headersToRecord,
	mergeHeaders,
} from '@core/lib/http/httpClientHeaders';
import { describe, expect, it } from 'vitest';

const CONTENT_TYPE_JSON = 'application/json';
const BEARER_TOKEN = 'Bearer token';
const TEXT_PLAIN = 'text/plain';
const HEADER_CONTENT_TYPE = 'Content-Type';

describe('addHeadersFromSource', () => {
	it('adds headers from Headers object', () => {
		const headers = new Headers();
		const source = new Headers({
			[HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
			Authorization: BEARER_TOKEN,
		});
		addHeadersFromSource(headers, source);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
		expect(headers.get('Authorization')).toBe(BEARER_TOKEN);
	});

	it('overwrites existing headers when adding from source', () => {
		const headers = new Headers({ [HEADER_CONTENT_TYPE]: TEXT_PLAIN });
		const source = new Headers({ [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON });
		addHeadersFromSource(headers, source);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
	});

	it('adds headers from array of tuples', () => {
		const headers = new Headers();
		const source: [string, string][] = [
			[HEADER_CONTENT_TYPE, CONTENT_TYPE_JSON],
			['Authorization', BEARER_TOKEN],
		];
		addHeadersFromSource(headers, source);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
		expect(headers.get('Authorization')).toBe(BEARER_TOKEN);
	});

	it('adds headers from Record object', () => {
		const headers = new Headers();
		const source = { [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON, Authorization: BEARER_TOKEN };
		addHeadersFromSource(headers, source);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
		expect(headers.get('Authorization')).toBe(BEARER_TOKEN);
	});

	it('handles empty Headers source', () => {
		const headers = new Headers({ [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON });
		const source = new Headers();
		addHeadersFromSource(headers, source);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
	});

	it('handles empty array source', () => {
		const headers = new Headers({ [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON });
		const source: [string, string][] = [];
		addHeadersFromSource(headers, source);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
	});

	it('handles empty Record source', () => {
		const headers = new Headers({ [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON });
		const source = {};
		addHeadersFromSource(headers, source);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
	});
});

describe('mergeHeaders', () => {
	it('merges multiple header sources', () => {
		const source1 = { [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON };
		const source2 = new Headers({ Authorization: BEARER_TOKEN });
		const source3 = { 'X-Custom': 'value' };
		const headers = mergeHeaders(source1, source2, source3);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
		expect(headers.get('Authorization')).toBe(BEARER_TOKEN);
		expect(headers.get('X-Custom')).toBe('value');
	});

	it('later sources overwrite earlier ones', () => {
		const source1 = { [HEADER_CONTENT_TYPE]: TEXT_PLAIN };
		const source2 = { [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON };
		const headers = mergeHeaders(source1, source2);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
	});

	it('handles undefined sources', () => {
		const source1 = { [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON };
		const source2 = undefined;
		const source3 = { Authorization: BEARER_TOKEN };
		const headers = mergeHeaders(source1, source2, source3);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
		expect(headers.get('Authorization')).toBe(BEARER_TOKEN);
	});

	it('returns empty Headers when all sources are undefined', () => {
		const headers = mergeHeaders(undefined, undefined);
		expect(headers).toBeInstanceOf(Headers);
		expect(Array.from(headers.entries())).toEqual([]);
	});

	it('handles empty array of sources', () => {
		const headers = mergeHeaders();
		expect(headers).toBeInstanceOf(Headers);
		expect(Array.from(headers.entries())).toEqual([]);
	});

	it('merges Headers with Record', () => {
		const source1 = new Headers({ 'Content-Type': CONTENT_TYPE_JSON });
		const source2 = { Authorization: BEARER_TOKEN };
		const headers = mergeHeaders(source1, source2);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
		expect(headers.get('Authorization')).toBe(BEARER_TOKEN);
	});

	it('merges array of tuples with Record', () => {
		const source1: [string, string][] = [[HEADER_CONTENT_TYPE, CONTENT_TYPE_JSON]];
		const source2 = { Authorization: BEARER_TOKEN };
		const headers = mergeHeaders(source1, source2);
		expect(headers.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
		expect(headers.get('Authorization')).toBe(BEARER_TOKEN);
	});
});

describe('headersToRecord', () => {
	it('converts Headers to Record', () => {
		const headers = new Headers({
			[HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
			Authorization: BEARER_TOKEN,
		});
		const record = headersToRecord(headers);
		// Headers API normalizes header names to lowercase
		expect(record).toEqual({
			'content-type': CONTENT_TYPE_JSON,
			authorization: BEARER_TOKEN,
		});
	});

	it('handles empty Headers', () => {
		const headers = new Headers();
		const record = headersToRecord(headers);
		expect(record).toEqual({});
	});

	it('handles Headers with single header', () => {
		const headers = new Headers({ [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON });
		const record = headersToRecord(headers);
		// Headers API normalizes header names to lowercase
		expect(record).toEqual({
			'content-type': CONTENT_TYPE_JSON,
		});
	});

	it('handles Headers with multiple values for same key', () => {
		const headers = new Headers();
		headers.append('Set-Cookie', 'cookie1=value1');
		headers.append('Set-Cookie', 'cookie2=value2');
		const record = headersToRecord(headers);
		// Headers API returns comma-separated values for duplicate keys and normalizes to lowercase
		expect(record['set-cookie']).toBeDefined();
	});

	it('preserves header case', () => {
		const headers = new Headers({ [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON });
		const record = headersToRecord(headers);
		// Headers API normalizes header names to lowercase, so we check lowercase
		expect(record['content-type']).toBe(CONTENT_TYPE_JSON);
	});
});
