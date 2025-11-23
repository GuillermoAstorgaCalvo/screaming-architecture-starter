import { getCryptoApi } from '@core/security/csp/cryptoUtils';
import { generateHash, generateHashSync } from '@core/security/csp/hash';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock cryptoUtils
vi.mock('@core/security/csp/cryptoUtils', async () => {
	const actual = await vi.importActual('@core/security/csp/cryptoUtils');
	return {
		...actual,
		getCryptoApi: vi.fn(),
	};
});

const CONTENT_MUST_BE_NON_EMPTY_STRING = 'Content must be a non-empty string';
const SUBTLE_CRYPTO_NOT_AVAILABLE =
	'SubtleCrypto not available. Generate hashes server-side or at build time.';

// Helper function to create mock crypto with digest
function createMockCrypto(digestReturnValue: ArrayBuffer) {
	const mockDigest = vi.fn().mockResolvedValue(digestReturnValue);
	return {
		subtle: {
			digest: mockDigest,
		},
		mockDigest,
	} as unknown as Crypto & { mockDigest: ReturnType<typeof vi.fn> };
}

// Helper function to create mock crypto without subtle
function createMockCryptoWithoutSubtle() {
	return {
		subtle: undefined,
	} as unknown as Crypto;
}

// Helper function to test hash algorithm generation
async function testHashAlgorithm(
	algorithm: 'sha256' | 'sha384' | 'sha512',
	bufferSize: number,
	expectedPrefix: string
) {
	const mockCryptoWithDigest = createMockCrypto(new Uint8Array(bufferSize).buffer);
	const mockCrypto = mockCryptoWithDigest as Crypto;
	vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

	const content = 'console.log("hello");';
	const hash = await generateHash(content, algorithm);

	expect(hash).toMatch(new RegExp(`^${expectedPrefix}-`));
	expect(mockCryptoWithDigest.mockDigest).toHaveBeenCalled();
	const [calledAlgorithm, encodedData] = mockCryptoWithDigest.mockDigest.mock.calls[0] as [
		string,
		Uint8Array,
	];
	const expectedAlgorithm = `SHA-${algorithm.slice(3)}`;
	expect(calledAlgorithm).toBe(expectedAlgorithm);
	expect(encodedData).toBeDefined();
	expect(encodedData.constructor.name).toBe('Uint8Array');
}

// Helper function to setup actual crypto for edge case tests
function setupActualCrypto() {
	const actualCrypto = globalThis.crypto;
	if (!actualCrypto?.subtle) {
		return null;
	}
	vi.mocked(getCryptoApi).mockReturnValue(actualCrypto);
	return actualCrypto;
}

describe('generateHash - hash algorithms', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('generates SHA-256 hash by default', async () => {
		await testHashAlgorithm('sha256', 32, 'sha256');
	});

	it('generates SHA-384 hash when specified', async () => {
		await testHashAlgorithm('sha384', 48, 'sha384');
	});

	it('generates SHA-512 hash when specified', async () => {
		await testHashAlgorithm('sha512', 64, 'sha512');
	});
});

describe('generateHash - content encoding', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('encodes content correctly', async () => {
		const mockCryptoWithDigest = createMockCrypto(new Uint8Array(32).buffer);
		const mockCrypto = mockCryptoWithDigest as Crypto;
		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		const content = 'test content';
		await generateHash(content);

		expect(mockCryptoWithDigest.mockDigest).toHaveBeenCalled();
		const [algorithm, encodedData] = mockCryptoWithDigest.mockDigest.mock.calls[0] as [
			string,
			Uint8Array,
		];
		expect(algorithm).toBe('SHA-256');
		expect(encodedData).toBeDefined();
		expect(encodedData.constructor.name).toBe('Uint8Array');
		// Verify the encoded content matches
		const encoder = new TextEncoder();
		const expectedBytes = encoder.encode(content);
		expect(encodedData).toEqual(expectedBytes);
	});
});

describe('generateHash - input validation errors', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('throws error when content is empty string', async () => {
		const mockCrypto = createMockCrypto(new Uint8Array(32).buffer) as Crypto;
		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		await expect(generateHash('')).rejects.toThrow(CONTENT_MUST_BE_NON_EMPTY_STRING);
	});

	it('throws error when content is not a string', async () => {
		const mockCrypto = createMockCrypto(new Uint8Array(32).buffer) as Crypto;
		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		await expect(generateHash(null as unknown as string)).rejects.toThrow(
			CONTENT_MUST_BE_NON_EMPTY_STRING
		);
		await expect(generateHash(undefined as unknown as string)).rejects.toThrow(
			CONTENT_MUST_BE_NON_EMPTY_STRING
		);
		await expect(generateHash(123 as unknown as string)).rejects.toThrow(
			CONTENT_MUST_BE_NON_EMPTY_STRING
		);
	});
});

describe('generateHash - crypto availability errors', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('throws error when SubtleCrypto is not available', async () => {
		vi.mocked(getCryptoApi).mockReturnValue(undefined);

		await expect(generateHash('test')).rejects.toThrow(SUBTLE_CRYPTO_NOT_AVAILABLE);
	});

	it('throws error when crypto.subtle is not available', async () => {
		const mockCrypto = createMockCryptoWithoutSubtle();
		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		await expect(generateHash('test')).rejects.toThrow(SUBTLE_CRYPTO_NOT_AVAILABLE);
	});
});

describe('generateHash - digest operation errors', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('throws error when digest operation fails', async () => {
		const mockCrypto = {
			subtle: {
				digest: vi.fn().mockRejectedValue(new Error('Digest failed')),
			},
		} as unknown as Crypto;

		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		await expect(generateHash('test')).rejects.toThrow(
			'Failed to generate hash: Digest failed. Generate hashes server-side or at build time.'
		);
	});

	it('handles non-Error exceptions in digest', async () => {
		const mockCrypto = {
			subtle: {
				digest: vi.fn().mockRejectedValue('String error'),
			},
		} as unknown as Crypto;

		vi.mocked(getCryptoApi).mockReturnValue(mockCrypto);

		await expect(generateHash('test')).rejects.toThrow(
			'Failed to generate hash: String error. Generate hashes server-side or at build time.'
		);
	});
});

describe('generateHash - consistency', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('produces consistent hashes for same content', async () => {
		if (!setupActualCrypto()) {
			return;
		}

		const content = 'consistent content';
		const hash1 = await generateHash(content);
		const hash2 = await generateHash(content);

		expect(hash1).toBe(hash2);
		expect(hash1).toMatch(/^sha256-[\d+/=A-Za-z]+$/);
	});

	it('produces different hashes for different content', async () => {
		if (!setupActualCrypto()) {
			return;
		}

		const hash1 = await generateHash('content1');
		const hash2 = await generateHash('content2');

		expect(hash1).not.toBe(hash2);
	});
});

describe('generateHash - content handling', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles unicode content', async () => {
		if (!setupActualCrypto()) {
			return;
		}

		const content = 'Hello 世界 🌍';
		const hash = await generateHash(content);

		expect(hash).toMatch(/^sha256-[\d+/=A-Za-z]+$/);
		expect(hash.length).toBeGreaterThan(10);
	});

	it('handles long content', async () => {
		if (!setupActualCrypto()) {
			return;
		}

		const content = 'a'.repeat(10000);
		const hash = await generateHash(content);

		expect(hash).toMatch(/^sha256-[\d+/=A-Za-z]+$/);
	});

	it('handles content with special characters', async () => {
		if (!setupActualCrypto()) {
			return;
		}

		const content = 'console.log("test");\n\tconst x = { a: 1 };';
		const hash = await generateHash(content);

		expect(hash).toMatch(/^sha256-[\d+/=A-Za-z]+$/);
	});

	it('handles content with unicode and special characters', async () => {
		if (!setupActualCrypto()) {
			return;
		}

		const content = 'console.log("Hello 世界 🌍");';
		const hash = await generateHash(content);

		expect(hash).toMatch(/^sha256-[\d+/=A-Za-z]+$/);
	});
});

describe('generateHash - algorithm comparison', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('generates different hashes for different algorithms', async () => {
		if (!setupActualCrypto()) {
			return;
		}

		const content = 'test content';
		const hash256 = await generateHash(content, 'sha256');
		const hash384 = await generateHash(content, 'sha384');
		const hash512 = await generateHash(content, 'sha512');

		expect(hash256).toMatch(/^sha256-/);
		expect(hash384).toMatch(/^sha384-/);
		expect(hash512).toMatch(/^sha512-/);
		expect(hash256).not.toBe(hash384);
		expect(hash384).not.toBe(hash512);
	});
});

describe('generateHashSync', () => {
	it('always throws an error', () => {
		expect(() => generateHashSync('test')).toThrow(
			'generateHashSync is not available in browser. Use generateHash (async) or generate hashes at build time/server-side.'
		);
	});

	it('throws error regardless of content', () => {
		expect(() => generateHashSync('')).toThrow();
		expect(() => generateHashSync('any content')).toThrow();
	});

	it('throws error regardless of algorithm', () => {
		expect(() => generateHashSync('test', 'sha256')).toThrow();
		expect(() => generateHashSync('test', 'sha384')).toThrow();
		expect(() => generateHashSync('test', 'sha512')).toThrow();
	});
});
