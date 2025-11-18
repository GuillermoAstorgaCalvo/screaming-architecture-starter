import { COOKIE_DELETE_EXPIRATION } from '@infra/storage/cookieStorageAdapter.constants';
import {
	calculateExpirationDate,
	serializeCookieOptions,
	serializeExpiration,
} from '@infra/storage/cookieStorageAdapter.serialization';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_DATE = '2024-01-01T00:00:00Z';
const CUSTOM_PATH = '/custom';

let originalWindow: Window & typeof globalThis;

beforeEach(() => {
	originalWindow = globalThis.window;
});

afterEach(() => {
	if (originalWindow) {
		globalThis.window = originalWindow;
	}
	vi.restoreAllMocks();
});

describe('calculateExpirationDate', () => {
	it('should calculate expiration date correctly', () => {
		const now = new Date(TEST_DATE);
		vi.useFakeTimers();
		vi.setSystemTime(now);

		const expiration = calculateExpirationDate(7);
		const expectedDate = new Date(now);
		expectedDate.setDate(expectedDate.getDate() + 7);

		expect(expiration).toBe(expectedDate.toUTCString());

		vi.useRealTimers();
	});

	it('should handle negative days', () => {
		const now = new Date(TEST_DATE);
		vi.useFakeTimers();
		vi.setSystemTime(now);

		const expiration = calculateExpirationDate(-1);
		const expectedDate = new Date(now);
		expectedDate.setDate(expectedDate.getDate() - 1);

		expect(expiration).toBe(expectedDate.toUTCString());

		vi.useRealTimers();
	});

	it('should handle zero days', () => {
		const now = new Date(TEST_DATE);
		vi.useFakeTimers();
		vi.setSystemTime(now);

		const expiration = calculateExpirationDate(0);
		const expectedDate = new Date(now);

		expect(expiration).toBe(expectedDate.toUTCString());

		vi.useRealTimers();
	});
});

describe('serializeExpiration', () => {
	it('should not add expiration when expiresDays is undefined', () => {
		const parts: string[] = [];
		serializeExpiration(undefined, parts);
		expect(parts).toEqual([]);
	});

	it('should add delete expiration when expiresDays is 0', () => {
		const parts: string[] = [];
		serializeExpiration(0, parts);
		expect(parts).toEqual([`expires=${COOKIE_DELETE_EXPIRATION}`]);
	});

	it('should add delete expiration when expiresDays is negative', () => {
		const parts: string[] = [];
		serializeExpiration(-1, parts);
		expect(parts).toEqual([`expires=${COOKIE_DELETE_EXPIRATION}`]);
	});

	it('should add future expiration when expiresDays is positive', () => {
		const now = new Date(TEST_DATE);
		vi.useFakeTimers();
		vi.setSystemTime(now);

		const parts: string[] = [];
		serializeExpiration(7, parts);
		expect(parts.length).toBe(1);
		expect(parts[0]).toMatch(/^expires=/);
		expect(parts[0]).not.toContain(COOKIE_DELETE_EXPIRATION);

		vi.useRealTimers();
	});
});

describe('serializeCookieOptions - basic options', () => {
	it('should include default options when no options provided', () => {
		const result = serializeCookieOptions();
		expect(result).toContain('path=/');
		expect(result).toContain('sameSite=Lax');
	});

	it('should include default path', () => {
		Object.defineProperty(globalThis, 'window', {
			value: {
				location: {
					protocol: 'https:',
				},
			},
			writable: true,
			configurable: true,
		});

		const result = serializeCookieOptions();
		expect(result).toContain('path=/');
	});

	it('should include custom path', () => {
		const result = serializeCookieOptions({ path: CUSTOM_PATH });
		expect(result).toContain(`path=${CUSTOM_PATH}`);
	});
});

describe('serializeCookieOptions - individual options', () => {
	it('should include domain when provided', () => {
		const result = serializeCookieOptions({ domain: 'example.com' });
		expect(result).toContain('domain=example.com');
	});

	it('should include sameSite when provided', () => {
		const result = serializeCookieOptions({ sameSite: 'Strict' });
		expect(result).toContain('sameSite=Strict');
	});

	it('should include secure flag when true', () => {
		const result = serializeCookieOptions({ secure: true });
		expect(result).toContain('secure');
	});

	it('should not include secure flag when false', () => {
		Object.defineProperty(globalThis, 'window', {
			value: {
				location: {
					protocol: 'http:',
				},
			},
			writable: true,
			configurable: true,
		});

		const result = serializeCookieOptions({ secure: false });
		expect(result).not.toContain('secure');
	});
});

describe('serializeCookieOptions - expiration options', () => {
	it('should include expiration when expiresDays is provided', () => {
		const result = serializeCookieOptions({ expiresDays: 7 });
		expect(result).toContain('expires=');
	});

	it('should include delete expiration when expiresDays is negative', () => {
		const result = serializeCookieOptions({ expiresDays: -1 });
		expect(result).toContain(`expires=${COOKIE_DELETE_EXPIRATION}`);
	});

	it('should handle options with only expiration', () => {
		const result = serializeCookieOptions({ expiresDays: 365 });
		expect(result).toContain('expires=');
		expect(result).toContain('path=/');
	});
});

describe('serializeCookieOptions - combined and complex options', () => {
	it('should combine multiple options', () => {
		const result = serializeCookieOptions({
			path: CUSTOM_PATH,
			domain: 'example.com',
			sameSite: 'Strict',
			secure: true,
			expiresDays: 30,
		});

		expect(result).toContain(`path=${CUSTOM_PATH}`);
		expect(result).toContain('domain=example.com');
		expect(result).toContain('sameSite=Strict');
		expect(result).toContain('secure');
		expect(result).toContain('expires=');
	});

	it('should format options with semicolon separator', () => {
		const result = serializeCookieOptions({
			path: '/',
			sameSite: 'Lax',
			secure: true,
		});

		expect(result.startsWith('; ')).toBe(true);
		const parts = result.split('; ').slice(1);
		expect(parts.length).toBeGreaterThanOrEqual(3);
	});

	it('should override defaults with provided options', () => {
		Object.defineProperty(globalThis, 'window', {
			value: {
				location: {
					protocol: 'https:',
				},
			},
			writable: true,
			configurable: true,
		});

		const result = serializeCookieOptions({
			path: CUSTOM_PATH,
			sameSite: 'None',
			secure: false,
		});

		expect(result).toContain(`path=${CUSTOM_PATH}`);
		expect(result).toContain('sameSite=None');
		expect(result).not.toContain('secure');
	});
});
