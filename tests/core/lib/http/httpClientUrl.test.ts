import { buildURL } from '@core/lib/http/httpClientUrl';
import { describe, expect, it } from 'vitest';

const TEST_URL = 'https://example.com/api/test';
const BASE_URL = 'https://example.com';

describe('buildURL - absolute URLs', () => {
	it('returns absolute URL as-is when URL starts with http://', () => {
		const url = 'http://example.com/api/test';
		const result = buildURL(url);
		expect(result).toBe('http://example.com/api/test');
	});

	it('returns absolute URL as-is when URL starts with https://', () => {
		const url = TEST_URL;
		const result = buildURL(url);
		expect(result).toBe(TEST_URL);
	});

	it('returns absolute URL as-is even when baseURL is provided', () => {
		const url = TEST_URL;
		const baseURL = 'https://other.example.com';
		const result = buildURL(url, baseURL);
		expect(result).toBe(TEST_URL);
	});
});

describe('buildURL - relative URLs without baseURL', () => {
	it('returns URL as-is when baseURL is not provided', () => {
		const url = '/api/test';
		const result = buildURL(url);
		expect(result).toBe('/api/test');
	});
});

describe('buildURL - relative URLs with baseURL', () => {
	it('combines baseURL and relative URL', () => {
		const url = '/api/test';
		const baseURL = BASE_URL;
		const result = buildURL(url, baseURL);
		expect(result).toBe(`${BASE_URL}/api/test`);
	});

	it('removes trailing slash from baseURL', () => {
		const url = '/api/test';
		const baseURL = `${BASE_URL}/`;
		const result = buildURL(url, baseURL);
		expect(result).toBe(`${BASE_URL}/api/test`);
	});

	it('adds leading slash to URL if missing', () => {
		const url = 'api/test';
		const baseURL = BASE_URL;
		const result = buildURL(url, baseURL);
		expect(result).toBe(`${BASE_URL}/api/test`);
	});

	it('handles URL that already has leading slash', () => {
		const url = '/api/test';
		const baseURL = BASE_URL;
		const result = buildURL(url, baseURL);
		expect(result).toBe(`${BASE_URL}/api/test`);
	});

	it('handles baseURL with trailing slash and URL with leading slash', () => {
		const url = '/api/test';
		const baseURL = `${BASE_URL}/`;
		const result = buildURL(url, baseURL);
		expect(result).toBe(`${BASE_URL}/api/test`);
	});

	it('handles baseURL without trailing slash and URL without leading slash', () => {
		const url = 'api/test';
		const baseURL = BASE_URL;
		const result = buildURL(url, baseURL);
		expect(result).toBe(`${BASE_URL}/api/test`);
	});
});

describe('buildURL - edge cases', () => {
	it('handles empty baseURL', () => {
		const url = '/api/test';
		const baseURL = '';
		const result = buildURL(url, baseURL);
		expect(result).toBe('/api/test');
	});

	it('handles baseURL with path', () => {
		const url = '/api/test';
		const baseURL = `${BASE_URL}/v1`;
		const result = buildURL(url, baseURL);
		expect(result).toBe(`${BASE_URL}/v1/api/test`);
	});

	it('handles complex URL paths', () => {
		const url = '/api/users/123/posts';
		const baseURL = 'https://api.example.com';
		const result = buildURL(url, baseURL);
		expect(result).toBe('https://api.example.com/api/users/123/posts');
	});
});

describe('buildURL - URLs with special characters', () => {
	it('handles URL with query parameters', () => {
		const url = '/api/test?key=value';
		const baseURL = BASE_URL;
		const result = buildURL(url, baseURL);
		expect(result).toBe(`${BASE_URL}/api/test?key=value`);
	});

	it('handles URL with hash', () => {
		const url = '/api/test#section';
		const baseURL = BASE_URL;
		const result = buildURL(url, baseURL);
		expect(result).toBe(`${BASE_URL}/api/test#section`);
	});
});
