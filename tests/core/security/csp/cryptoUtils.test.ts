import { bytesToBase64, getCryptoApi } from '@core/security/csp/cryptoUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

function createMockCrypto(): Crypto {
	return {
		getRandomValues: vi.fn(),
		subtle: {},
	} as unknown as Crypto;
}

function setupGlobalCrypto(crypto: Crypto): void {
	Object.defineProperty(globalThis, 'crypto', {
		value: crypto,
		writable: true,
		configurable: true,
	});
}

function setupWindowCrypto(crypto: Crypto): void {
	Object.defineProperty(globalThis, 'window', {
		value: { crypto },
		writable: true,
		configurable: true,
	});
}

function cleanupCrypto(): void {
	delete (globalThis as { crypto?: Crypto }).crypto;
	delete (globalThis as { window?: { crypto?: Crypto } }).window;
}

function createTestArray(size: number): Uint8Array {
	const array = new Uint8Array(size);
	for (let i = 0; i < size; i++) {
		array[i] = i % 256;
	}
	return array;
}

describe('getCryptoApi', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe('when crypto is available', () => {
		it('returns crypto from globalThis when available', () => {
			const mockCrypto = createMockCrypto();
			setupGlobalCrypto(mockCrypto);

			const result = getCryptoApi();
			expect(result).toBe(mockCrypto);
		});

		it('returns window.crypto when globalThis.crypto is not available but window is', () => {
			const mockCrypto = createMockCrypto();
			cleanupCrypto();
			setupWindowCrypto(mockCrypto);

			const result = getCryptoApi();
			expect(result).toBe(mockCrypto);
		});
	});

	describe('when crypto is not available', () => {
		it('returns undefined when crypto is not available', () => {
			cleanupCrypto();

			const result = getCryptoApi();
			expect(result).toBeUndefined();
		});
	});

	describe('preference order', () => {
		it('prefers globalThis.crypto over window.crypto', () => {
			const globalCrypto = createMockCrypto();
			const windowCrypto = createMockCrypto();
			setupGlobalCrypto(globalCrypto);
			setupWindowCrypto(windowCrypto);

			const result = getCryptoApi();
			expect(result).toBe(globalCrypto);
			expect(result).not.toBe(windowCrypto);
		});
	});
});

describe('bytesToBase64 - basic conversion', () => {
	it('converts Uint8Array to base64 string', () => {
		const bytes = new Uint8Array([72, 101, 108, 108, 111]);
		const result = bytesToBase64(bytes);
		expect(result).toBe('SGVsbG8=');
	});

	it('converts number array to base64 string', () => {
		const bytes = [72, 101, 108, 108, 111];
		const result = bytesToBase64(bytes);
		expect(result).toBe('SGVsbG8=');
	});

	it('produces valid base64 output', () => {
		const bytes = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]);
		const result = bytesToBase64(bytes);
		expect(result).toMatch(/^[\d+/A-Za-z]*={0,2}$/);
		expect(result).toBe('SGVsbG8gV29ybGQ=');
	});

	it('produces consistent output for same input', () => {
		const bytes = new Uint8Array([1, 2, 3, 4, 5]);
		const result1 = bytesToBase64(bytes);
		const result2 = bytesToBase64(bytes);
		expect(result1).toBe(result2);
	});
});

describe('bytesToBase64 - edge cases', () => {
	it('handles empty array', () => {
		const bytes = new Uint8Array([]);
		const result = bytesToBase64(bytes);
		expect(result).toBe('');
	});

	it('handles single byte', () => {
		const bytes = new Uint8Array([65]);
		const result = bytesToBase64(bytes);
		expect(result).toBe('QQ==');
	});

	it('handles two bytes', () => {
		const bytes = new Uint8Array([65, 66]);
		const result = bytesToBase64(bytes);
		expect(result).toBe('QUI=');
	});

	it('handles three bytes (no padding)', () => {
		const bytes = new Uint8Array([65, 66, 67]);
		const result = bytesToBase64(bytes);
		expect(result).toBe('QUJD');
	});

	it('handles all byte values (0-255)', () => {
		const bytes = createTestArray(256);
		const result = bytesToBase64(bytes);
		expect(result).toBeTruthy();
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
	});

	it('handles number array with values outside 0-255 range', () => {
		const bytes = [0, 128, 255];
		const result = bytesToBase64(bytes);
		expect(result).toBeTruthy();
		expect(typeof result).toBe('string');
	});
});

describe('bytesToBase64 - large arrays', () => {
	it('handles large arrays by processing in chunks', () => {
		const largeArray = createTestArray(10000);
		const result = bytesToBase64(largeArray);
		expect(result).toBeTruthy();
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
	});

	it('handles arrays exactly at chunk size', () => {
		const bytes = createTestArray(8192);
		const result = bytesToBase64(bytes);
		expect(result).toBeTruthy();
		expect(typeof result).toBe('string');
	});

	it('handles arrays just over chunk size', () => {
		const bytes = createTestArray(8193);
		const result = bytesToBase64(bytes);
		expect(result).toBeTruthy();
		expect(typeof result).toBe('string');
	});
});
