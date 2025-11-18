import { parseCookies } from '@infra/storage/cookieStorageAdapter.parsing';
import { describe, expect, it } from 'vitest';

describe('parseCookies - basic parsing', () => {
	it('should return empty Map for undefined input', () => {
		const cookies = parseCookies();
		expect(cookies).toBeInstanceOf(Map);
		expect(cookies.size).toBe(0);
	});

	it('should return empty Map for empty string', () => {
		const cookies = parseCookies('');
		expect(cookies).toBeInstanceOf(Map);
		expect(cookies.size).toBe(0);
	});

	it('should parse single cookie', () => {
		const cookies = parseCookies('key1=value1');
		expect(cookies.size).toBe(1);
		expect(cookies.get('key1')).toBe('value1');
	});

	it('should parse multiple cookies', () => {
		const cookies = parseCookies('key1=value1; key2=value2; key3=value3');
		expect(cookies.size).toBe(3);
		expect(cookies.get('key1')).toBe('value1');
		expect(cookies.get('key2')).toBe('value2');
		expect(cookies.get('key3')).toBe('value3');
	});
});

describe('parseCookies - formatting and encoding', () => {
	it('should handle cookies with spaces', () => {
		const cookies = parseCookies(' key1 = value1 ; key2 = value2 ');
		expect(cookies.size).toBe(2);
		expect(cookies.get('key1')).toBe('value1');
		expect(cookies.get('key2')).toBe('value2');
	});

	it('should decode URL-encoded values', () => {
		const cookies = parseCookies('key1=value%20with%20spaces; key2=value%2Bplus');
		expect(cookies.get('key1')).toBe('value with spaces');
		expect(cookies.get('key2')).toBe('value+plus');
	});

	it('should handle special characters in values', () => {
		const cookies = parseCookies('key1=value%21%40%23; key2=test%2Fpath');
		expect(cookies.get('key1')).toBe('value!@#');
		expect(cookies.get('key2')).toBe('test/path');
	});
});

describe('parseCookies - special value handling', () => {
	it('should handle values containing equals sign', () => {
		const cookies = parseCookies('key1=value=with=equals');
		expect(cookies.get('key1')).toBe('value=with=equals');
	});

	it('should handle empty values', () => {
		const cookies = parseCookies('key1=; key2=value2');
		expect(cookies.size).toBe(2);
		expect(cookies.get('key1')).toBe('');
		expect(cookies.get('key2')).toBe('value2');
	});

	it('should handle cookies without values', () => {
		const cookies = parseCookies('key1; key2=value2');
		expect(cookies.size).toBe(1);
		expect(cookies.get('key2')).toBe('value2');
	});
});

describe('parseCookies - complex scenarios', () => {
	it('should handle cookies with attributes (ignore them)', () => {
		const cookies = parseCookies('key1=value1; path=/; secure; key2=value2');
		expect(cookies.size).toBe(2);
		expect(cookies.get('key1')).toBe('value1');
		expect(cookies.get('key2')).toBe('value2');
	});

	it('should overwrite duplicate keys (last one wins)', () => {
		const cookies = parseCookies('key1=value1; key1=value2');
		expect(cookies.size).toBe(1);
		expect(cookies.get('key1')).toBe('value2');
	});

	it('should handle complex cookie string with mixed formats', () => {
		const cookies = parseCookies('key1=value1; key2=value%20two; key3=value=with=equals; key4=');
		expect(cookies.size).toBe(4);
		expect(cookies.get('key1')).toBe('value1');
		expect(cookies.get('key2')).toBe('value two');
		expect(cookies.get('key3')).toBe('value=with=equals');
		expect(cookies.get('key4')).toBe('');
	});

	it('should handle malformed cookie strings gracefully', () => {
		const cookies = parseCookies('=value1; key2=; =');
		expect(cookies.size).toBe(0);
	});

	it('should handle cookies with only whitespace keys', () => {
		const cookies = parseCookies(' =value1; key2=value2');
		expect(cookies.size).toBe(1);
		expect(cookies.get('key2')).toBe('value2');
	});
});
