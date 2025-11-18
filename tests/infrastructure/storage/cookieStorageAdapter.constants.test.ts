import {
	COOKIE_DELETE_EXPIRATION,
	DEFAULT_COOKIE_EXPIRATION_DAYS,
	getDefaultCookieOptions,
	isCookieStorageAvailable,
} from '@infra/storage/cookieStorageAdapter.constants';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('cookieStorageAdapter.constants', () => {
	let originalDocument: Document;
	let originalWindow: Window & typeof globalThis;

	beforeEach(() => {
		originalDocument = globalThis.document;
		originalWindow = globalThis.window;
	});

	afterEach(() => {
		if (originalDocument) {
			globalThis.document = originalDocument;
		}
		if (originalWindow) {
			globalThis.window = originalWindow;
		}
		vi.restoreAllMocks();
	});

	describeDefaultCookieExpirationDays();
	describeCookieDeleteExpiration();
	describeGetDefaultCookieOptions();
	describeIsCookieStorageAvailable();
});

function describeDefaultCookieExpirationDays() {
	describe('DEFAULT_COOKIE_EXPIRATION_DAYS', () => {
		it('should be 365', () => {
			expect(DEFAULT_COOKIE_EXPIRATION_DAYS).toBe(365);
		});
	});
}

function describeCookieDeleteExpiration() {
	describe('COOKIE_DELETE_EXPIRATION', () => {
		it('should be a past date string', () => {
			expect(COOKIE_DELETE_EXPIRATION).toBe('Thu, 01 Jan 1970 00:00:00 GMT');
		});
	});
}

function describeGetDefaultCookieOptions() {
	describe('getDefaultCookieOptions', () => {
		it('should return default options with path "/"', () => {
			const options = getDefaultCookieOptions();
			expect(options.path).toBe('/');
		});

		it('should return default options with sameSite "Lax"', () => {
			const options = getDefaultCookieOptions();
			expect(options.sameSite).toBe('Lax');
		});

		it('should return secure true in HTTPS environment', () => {
			Object.defineProperty(globalThis, 'window', {
				value: {
					location: {
						protocol: 'https:',
					},
				},
				writable: true,
				configurable: true,
			});

			const options = getDefaultCookieOptions();
			expect(options.secure).toBe(true);
		});

		it('should return secure false in HTTP environment', () => {
			Object.defineProperty(globalThis, 'window', {
				value: {
					location: {
						protocol: 'http:',
					},
				},
				writable: true,
				configurable: true,
			});

			const options = getDefaultCookieOptions();
			expect(options.secure).toBe(false);
		});

		it('should return secure false when window is undefined', () => {
			// @ts-expect-error - Intentionally removing window for SSR test
			delete globalThis.window;

			const options = getDefaultCookieOptions();
			expect(options.secure).toBe(false);
		});

		it('should return secure false when location is undefined', () => {
			Object.defineProperty(globalThis, 'window', {
				value: {},
				writable: true,
				configurable: true,
			});

			const options = getDefaultCookieOptions();
			expect(options.secure).toBe(false);
		});
	});
}

function describeIsCookieStorageAvailable() {
	describe('isCookieStorageAvailable', () => {
		it('should return true when document and cookies are available', () => {
			Object.defineProperty(globalThis, 'document', {
				value: {
					cookie: 'test=value',
				},
				writable: true,
				configurable: true,
			});

			expect(isCookieStorageAvailable()).toBe(true);
		});

		it('should return false when document is undefined', () => {
			// @ts-expect-error - Intentionally removing document for SSR test
			delete globalThis.document;

			expect(isCookieStorageAvailable()).toBe(false);
		});

		it('should return false when document.cookie is not a string', () => {
			Object.defineProperty(globalThis, 'document', {
				value: {
					cookie: null,
				},
				writable: true,
				configurable: true,
			});

			expect(isCookieStorageAvailable()).toBe(false);
		});

		it('should return false when document.cookie is undefined', () => {
			Object.defineProperty(globalThis, 'document', {
				value: {},
				writable: true,
				configurable: true,
			});

			expect(isCookieStorageAvailable()).toBe(false);
		});

		it('should return true with empty cookie string', () => {
			Object.defineProperty(globalThis, 'document', {
				value: {
					cookie: '',
				},
				writable: true,
				configurable: true,
			});

			expect(isCookieStorageAvailable()).toBe(true);
		});
	});
}
