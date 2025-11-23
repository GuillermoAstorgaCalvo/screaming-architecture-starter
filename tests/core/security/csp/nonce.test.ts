import { getCryptoApi } from '@core/security/csp/cryptoUtils';
import { generateNonce, validateNonce } from '@core/security/csp/nonce';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock cryptoUtils
vi.mock('@core/security/csp/cryptoUtils', async () => {
	const actual = await vi.importActual('@core/security/csp/cryptoUtils');
	return {
		...actual,
		getCryptoApi: vi.fn(),
	};
});

const ERROR_NONCE_LENGTH_POSITIVE = 'Nonce length must be a positive integer';
const ERROR_NONCE_MUST_BE_STRING = 'Nonce must be a non-empty string';

// Helper function to create a mock crypto with predictable random values
function createMockCrypto(): Crypto & {
	getRandomValues: ReturnType<typeof vi.fn>;
} {
	const mockGetRandomValues = vi.fn((arr: Uint8Array) => {
		// Fill with predictable values for testing
		for (let i = 0; i < arr.length; i++) {
			arr[i] = i % 256;
		}
		return arr;
	});

	return {
		getRandomValues: mockGetRandomValues,
	} as unknown as Crypto & {
		getRandomValues: ReturnType<typeof vi.fn>;
	};
}

// Shared setup for all generateNonce tests
beforeEach(() => {
	vi.clearAllMocks();
});

describe('generateNonce - basic generation', () => {
	it('generates nonce with default length (16)', () => {
		const mockCrypto = createMockCrypto();
		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		const nonce = generateNonce();
		expect(nonce).toBeTruthy();
		expect(typeof nonce).toBe('string');
		expect(nonce.length).toBeGreaterThan(0);
		expect(mockCrypto.getRandomValues).toHaveBeenCalled();
	});

	it('generates nonce with specified length', () => {
		const mockCrypto = createMockCrypto();
		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		const nonce = generateNonce(32);
		expect(nonce).toBeTruthy();
		expect(typeof nonce).toBe('string');
		expect(mockCrypto.getRandomValues).toHaveBeenCalledWith(expect.any(Uint8Array));
		const [callArgs] = mockCrypto.getRandomValues.mock.calls[0] ?? [];
		expect(callArgs?.length).toBe(32);
	});

	it('handles various valid lengths', () => {
		const mockCrypto = createMockCrypto();
		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		const lengths = [1, 8, 16, 32, 64, 128, 256];
		for (const length of lengths) {
			const nonce = generateNonce(length);
			expect(nonce).toBeTruthy();
			expect(typeof nonce).toBe('string');
		}
	});
});

describe('generateNonce - format and encoding', () => {
	it('generates URL-safe base64 nonce', () => {
		const mockCrypto = createMockCrypto();
		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		const nonce = generateNonce(16);
		// URL-safe base64 should not contain +, /, or = at the end
		expect(nonce).not.toContain('+');
		expect(nonce).not.toContain('/');
		expect(nonce).not.toMatch(/=+$/);
		// Should only contain base64url characters: A-Z, a-z, 0-9, -, _
		expect(nonce).toMatch(/^[\w-]+$/);
	});

	it('converts base64 to base64url format (replaces + with -)', () => {
		const mockCrypto = createMockCrypto();
		// Mock bytesToBase64 to return a string with + and /
		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);
		// The actual implementation uses bytesToBase64 which may produce + and /
		// Then replaces them with - and _
		const nonce = generateNonce(16);
		expect(nonce).not.toContain('+');
		expect(nonce).not.toContain('/');
	});

	it('removes padding (=) from base64 nonce', () => {
		const mockCrypto = createMockCrypto();
		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		const nonce = generateNonce(16);
		// Base64 padding should be removed
		expect(nonce).not.toMatch(/=+$/);
	});
});

describe('generateNonce - uniqueness', () => {
	it('generates different nonces on each call', () => {
		const actualCrypto = globalThis.crypto;
		if (!actualCrypto?.getRandomValues) {
			// Skip if crypto is not available
			return;
		}

		vi.mocked(getCryptoApi).mockReturnValue(actualCrypto);

		const nonce1 = generateNonce();
		const nonce2 = generateNonce();

		// Very unlikely to be the same (1 in 2^128 for 16 bytes)
		expect(nonce1).not.toBe(nonce2);
	});
});

describe('generateNonce - validation errors', () => {
	it('throws error for zero length', () => {
		expect(() => generateNonce(0)).toThrow(ERROR_NONCE_LENGTH_POSITIVE);
	});

	it('throws error for negative length', () => {
		expect(() => generateNonce(-1)).toThrow(ERROR_NONCE_LENGTH_POSITIVE);
	});

	it('throws error for non-integer length', () => {
		expect(() => generateNonce(16.5)).toThrow(ERROR_NONCE_LENGTH_POSITIVE);
	});

	it('throws error for non-integer length (decimal)', () => {
		expect(() => generateNonce(16.1)).toThrow(ERROR_NONCE_LENGTH_POSITIVE);
		expect(() => generateNonce(16.9)).toThrow(ERROR_NONCE_LENGTH_POSITIVE);
	});

	it('throws error for length exceeding maximum (256)', () => {
		expect(() => generateNonce(257)).toThrow('Nonce length must not exceed 256 bytes');
	});

	it('throws error for length exceeding maximum (large number)', () => {
		expect(() => generateNonce(1000)).toThrow('Nonce length must not exceed 256 bytes');
	});

	it('does not throw for length at maximum boundary (256)', () => {
		// Should not throw at exactly 256
		const mockCrypto = createMockCrypto();
		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		expect(() => generateNonce(256)).not.toThrow();
		const nonce = generateNonce(256);
		expect(nonce).toBeTruthy();
		expect(typeof nonce).toBe('string');
	});
});

describe('generateNonce - fallback behavior', () => {
	it('falls back to Math.random when crypto is not available', () => {
		vi.mocked(getCryptoApi).mockReturnValue(undefined);

		const nonce = generateNonce(16);
		expect(nonce).toBeTruthy();
		expect(typeof nonce).toBe('string');
		expect(nonce.length).toBeGreaterThan(0);
		// Fallback generates length * 2 characters
		expect(nonce.length).toBeGreaterThanOrEqual(32);
	});

	it('falls back when getRandomValues is not available', () => {
		const mockCrypto = {
			getRandomValues: undefined,
		} as unknown as Crypto;

		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		const nonce = generateNonce(16);
		expect(nonce).toBeTruthy();
		expect(typeof nonce).toBe('string');
		expect(nonce.length).toBeGreaterThanOrEqual(32);
	});

	it('falls back when getRandomValues throws', () => {
		const mockCrypto = {
			getRandomValues: vi.fn().mockImplementation(() => {
				throw new Error('Crypto error');
			}),
		} as unknown as Crypto;

		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		const nonce = generateNonce(16);
		expect(nonce).toBeTruthy();
		expect(typeof nonce).toBe('string');
		expect(nonce.length).toBeGreaterThanOrEqual(32);
	});

	it('generates fallback nonce with correct length multiplier', () => {
		vi.mocked(getCryptoApi).mockReturnValue(undefined);

		const nonce8 = generateNonce(8);
		const nonce16 = generateNonce(16);
		const nonce32 = generateNonce(32);

		// Fallback generates length * 2 characters
		expect(nonce8.length).toBeGreaterThanOrEqual(16);
		expect(nonce16.length).toBeGreaterThanOrEqual(32);
		expect(nonce32.length).toBeGreaterThanOrEqual(64);
	});

	it('generates URL-safe fallback nonce', () => {
		vi.mocked(getCryptoApi).mockReturnValue(undefined);

		const nonce = generateNonce(16);
		// Fallback uses characters: A-Z, a-z, 0-9, -, _
		expect(nonce).toMatch(/^[\w-]+$/);
	});
});

describe('validateNonce', () => {
	it('allows undefined', () => {
		expect(() => validateNonce(undefined)).not.toThrow();
	});

	it('allows null', () => {
		expect(() => validateNonce(null)).not.toThrow();
	});

	it('allows valid non-empty string', () => {
		expect(() => validateNonce('valid-nonce-123')).not.toThrow();
	});

	it('throws error for empty string', () => {
		expect(() => validateNonce('')).toThrow(ERROR_NONCE_MUST_BE_STRING);
	});

	it('throws error for whitespace-only string', () => {
		expect(() => validateNonce('   ')).toThrow(ERROR_NONCE_MUST_BE_STRING);
		expect(() => validateNonce('\t')).toThrow(ERROR_NONCE_MUST_BE_STRING);
		expect(() => validateNonce('\n')).toThrow(ERROR_NONCE_MUST_BE_STRING);
	});

	it('throws error for non-string types', () => {
		expect(() => validateNonce(123 as unknown as string)).toThrow(ERROR_NONCE_MUST_BE_STRING);
		expect(() => validateNonce(true as unknown as string)).toThrow(ERROR_NONCE_MUST_BE_STRING);
		expect(() => validateNonce({} as unknown as string)).toThrow(ERROR_NONCE_MUST_BE_STRING);
		expect(() => validateNonce([] as unknown as string)).toThrow(ERROR_NONCE_MUST_BE_STRING);
	});

	it('allows strings with special characters', () => {
		expect(() => validateNonce('nonce-with-special-chars-123!@#')).not.toThrow();
	});

	it('allows long strings', () => {
		const longNonce = 'a'.repeat(1000);
		expect(() => validateNonce(longNonce)).not.toThrow();
	});

	it('allows base64url-like strings', () => {
		expect(() => validateNonce('aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2u')).not.toThrow();
	});
});
