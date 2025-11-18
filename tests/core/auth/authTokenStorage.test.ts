import { createAuthTokenStorage } from '@core/auth/authTokenStorage';
import type { AuthTokens } from '@core/ports/AuthPort';
import type { StoragePort } from '@core/ports/StoragePort';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { describe, expect, it, vi } from 'vitest';

const DEFAULT_KEY = 'app.auth.tokens';
const CUSTOM_KEY = 'custom.auth.key';

const createTokens = (overrides: Partial<AuthTokens> = {}): AuthTokens => ({
	accessToken: 'access-token-123',
	refreshToken: 'refresh-token-456',
	expiresAt: Date.now() + 3600000, // 1 hour from now
	...overrides,
});

const createMockStorage = (): StoragePort => ({
	getItem: vi.fn().mockReturnValue(null),
	setItem: vi.fn().mockReturnValue(true),
	removeItem: vi.fn().mockReturnValue(true),
	clear: vi.fn().mockReturnValue(true),
	getLength: vi.fn().mockReturnValue(0),
	key: vi.fn().mockReturnValue(null),
});

const getSavedTokenData = (storage: StoragePort): unknown => {
	const [, serialized] = (storage.setItem as ReturnType<typeof vi.fn>).mock.calls[0] ?? [];
	if (!serialized) {
		return null;
	}
	return JSON.parse(serialized as string);
};

describe('createAuthTokenStorage - token storage basic operations', () => {
	it('saves tokens to storage with default key', () => {
		const storage = createMockStorage();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens = createTokens();

		const result = tokenStorage.saveTokens(tokens);

		expect(result).toBe(true);
		expect(storage.setItem).toHaveBeenCalledWith(
			DEFAULT_KEY,
			expect.stringContaining('"accessToken":"access-token-123"')
		);
	});

	it('saves tokens to storage with custom key', () => {
		const storage = createMockStorage();
		const tokenStorage = createAuthTokenStorage(storage, { key: CUSTOM_KEY });
		const tokens = createTokens();

		tokenStorage.saveTokens(tokens);

		expect(storage.setItem).toHaveBeenCalledWith(
			CUSTOM_KEY,
			expect.stringContaining('"accessToken":"access-token-123"')
		);
	});

	it('trims custom key whitespace', () => {
		const storage = createMockStorage();
		const tokenStorage = createAuthTokenStorage(storage, {
			key: '  trimmed-key  ',
		});
		const tokens = createTokens();

		tokenStorage.saveTokens(tokens);

		expect(storage.setItem).toHaveBeenCalledWith('trimmed-key', expect.any(String));
	});

	it('returns false when storage.setItem fails', () => {
		const storage = createMockStorage();
		(storage.setItem as ReturnType<typeof vi.fn>).mockReturnValue(false);
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens = createTokens();

		const result = tokenStorage.saveTokens(tokens);

		expect(result).toBe(false);
	});
});

describe('createAuthTokenStorage - token storage refreshToken handling', () => {
	it('saves tokens without refreshToken when null', () => {
		const storage = createMockStorage();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens = createTokens({ refreshToken: null });

		tokenStorage.saveTokens(tokens);

		const parsed = getSavedTokenData(storage) as { refreshToken: unknown };
		expect(parsed?.refreshToken).toBeNull();
	});

	it('saves tokens without refreshToken when omitted (normalized to null)', () => {
		const storage = createMockStorage();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens: AuthTokens = {
			accessToken: 'token',
			expiresAt: Date.now() + 3600000,
		};

		tokenStorage.saveTokens(tokens);

		const parsed = getSavedTokenData(storage) as { refreshToken: unknown };
		expect(parsed?.refreshToken).toBeNull();
	});
});

describe('createAuthTokenStorage - token storage expiresAt handling', () => {
	it('saves tokens without expiresAt when undefined', () => {
		const storage = createMockStorage();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens: AuthTokens = {
			accessToken: 'token',
			refreshToken: 'refresh',
		};

		tokenStorage.saveTokens(tokens);

		const parsed = getSavedTokenData(storage) as { expiresAt: unknown };
		expect(parsed?.expiresAt).toBeUndefined();
	});

	it('saves tokens with expiresAt when provided', () => {
		const storage = createMockStorage();
		const tokenStorage = createAuthTokenStorage(storage);
		const expiresAt = Date.now() + 3600000;
		const tokens = createTokens({ expiresAt });

		tokenStorage.saveTokens(tokens);

		const parsed = getSavedTokenData(storage) as { expiresAt: unknown };
		expect(parsed?.expiresAt).toBe(expiresAt);
	});

	it('saves tokens with expiresAt when null', () => {
		const storage = createMockStorage();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens = createTokens({ expiresAt: null });

		tokenStorage.saveTokens(tokens);

		const parsed = getSavedTokenData(storage) as { expiresAt: unknown };
		expect(parsed?.expiresAt).toBeNull();
	});
});

describe('createAuthTokenStorage - token retrieval basic operations', () => {
	it('loads tokens from storage with default key', () => {
		const storage = new MockStorageAdapter();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens = createTokens();

		tokenStorage.saveTokens(tokens);
		const loaded = tokenStorage.loadTokens();

		expect(loaded).toEqual(tokens);
	});

	it('loads tokens from storage with custom key', () => {
		const storage = new MockStorageAdapter();
		const tokenStorage = createAuthTokenStorage(storage, { key: CUSTOM_KEY });
		const tokens = createTokens();

		tokenStorage.saveTokens(tokens);
		const loaded = tokenStorage.loadTokens();

		expect(loaded).toEqual(tokens);
	});

	it('returns null when no tokens are stored', () => {
		const storage = createMockStorage();
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded).toBeNull();
	});

	it('returns null when storage.getItem returns null', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded).toBeNull();
	});
});

describe('createAuthTokenStorage - token retrieval optional fields', () => {
	it('loads tokens without refreshToken', () => {
		const storage = new MockStorageAdapter();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens: AuthTokens = {
			accessToken: 'token',
			expiresAt: Date.now() + 3600000,
		};

		tokenStorage.saveTokens(tokens);
		const loaded = tokenStorage.loadTokens();

		expect(loaded).toEqual({
			accessToken: tokens.accessToken,
			refreshToken: null,
			expiresAt: tokens.expiresAt,
		});
	});

	it('loads tokens without expiresAt', () => {
		const storage = new MockStorageAdapter();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens: AuthTokens = {
			accessToken: 'token',
			refreshToken: 'refresh',
		};

		tokenStorage.saveTokens(tokens);
		const loaded = tokenStorage.loadTokens();

		expect(loaded).toEqual({
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
		});
	});

	it('loads tokens with null refreshToken', () => {
		const storage = new MockStorageAdapter();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens = createTokens({ refreshToken: null });

		tokenStorage.saveTokens(tokens);
		const loaded = tokenStorage.loadTokens();

		expect(loaded).toEqual({
			accessToken: tokens.accessToken,
			refreshToken: null,
			expiresAt: tokens.expiresAt,
		});
	});

	it('loads tokens with null expiresAt', () => {
		const storage = new MockStorageAdapter();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens = createTokens({ expiresAt: null });

		tokenStorage.saveTokens(tokens);
		const loaded = tokenStorage.loadTokens();

		expect(loaded).toEqual({
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			expiresAt: null,
		});
	});
});

describe('createAuthTokenStorage - token retrieval error handling invalid data', () => {
	it('returns null when stored value is not valid JSON', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('invalid-json');
		const tokenStorage = createAuthTokenStorage(storage);
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const loaded = tokenStorage.loadTokens();

		expect(loaded).toBeNull();
		expect(storage.removeItem).toHaveBeenCalledWith(DEFAULT_KEY);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			'Invalid auth token payload in storage, clearing value',
			expect.any(Error)
		);
		consoleWarnSpy.mockRestore();
	});

	it('returns null when stored value is null', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('null');
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded).toBeNull();
	});

	it('returns null when stored value is not an object', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('"string"');
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded).toBeNull();
	});
});

describe('createAuthTokenStorage - token retrieval error handling invalid fields', () => {
	it('returns null when accessToken is missing', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
			JSON.stringify({ refreshToken: 'refresh' })
		);
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded).toBeNull();
	});

	it('returns null when accessToken is not a string', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
			JSON.stringify({ accessToken: 123 })
		);
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded).toBeNull();
	});

	it('normalizes refreshToken when it is not a string or null', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
			JSON.stringify({
				accessToken: 'token',
				refreshToken: 123,
			})
		);
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded).toEqual({
			accessToken: 'token',
			refreshToken: null,
		});
	});
});

describe('createAuthTokenStorage - token removal', () => {
	it('removes tokens from storage with default key', () => {
		const storage = createMockStorage();
		const tokenStorage = createAuthTokenStorage(storage);

		const result = tokenStorage.clearTokens();

		expect(result).toBe(true);
		expect(storage.removeItem).toHaveBeenCalledWith(DEFAULT_KEY);
	});

	it('removes tokens from storage with custom key', () => {
		const storage = createMockStorage();
		const tokenStorage = createAuthTokenStorage(storage, { key: CUSTOM_KEY });

		tokenStorage.clearTokens();

		expect(storage.removeItem).toHaveBeenCalledWith(CUSTOM_KEY);
	});

	it('returns false when storage.removeItem fails', () => {
		const storage = createMockStorage();
		(storage.removeItem as ReturnType<typeof vi.fn>).mockReturnValue(false);
		const tokenStorage = createAuthTokenStorage(storage);

		const result = tokenStorage.clearTokens();

		expect(result).toBe(false);
	});

	it('clears tokens and subsequent load returns null', () => {
		const storage = new MockStorageAdapter();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens = createTokens();

		tokenStorage.saveTokens(tokens);
		expect(tokenStorage.loadTokens()).toEqual(tokens);

		tokenStorage.clearTokens();
		expect(tokenStorage.loadTokens()).toBeNull();
	});
});

describe('createAuthTokenStorage - token expiration basic operations', () => {
	it('saves and loads numeric expiresAt', () => {
		const storage = new MockStorageAdapter();
		const tokenStorage = createAuthTokenStorage(storage);
		const expiresAt = Date.now() + 3600000;
		const tokens = createTokens({ expiresAt });

		tokenStorage.saveTokens(tokens);
		const loaded = tokenStorage.loadTokens();

		expect(loaded?.expiresAt).toBe(expiresAt);
	});

	it('saves and loads null expiresAt', () => {
		const storage = new MockStorageAdapter();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens = createTokens({ expiresAt: null });

		tokenStorage.saveTokens(tokens);
		const loaded = tokenStorage.loadTokens();

		expect(loaded?.expiresAt).toBeNull();
	});

	it('saves and loads undefined expiresAt (omitted from storage)', () => {
		const storage = new MockStorageAdapter();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens: AuthTokens = {
			accessToken: 'token',
			refreshToken: 'refresh',
		};

		tokenStorage.saveTokens(tokens);
		const loaded = tokenStorage.loadTokens();

		expect(loaded?.expiresAt).toBeUndefined();
	});
});

describe('createAuthTokenStorage - token expiration normalization string values', () => {
	it('normalizes string numeric expiresAt on load', () => {
		const storage = createMockStorage();
		const expiresAt = Date.now() + 3600000;
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
			JSON.stringify({
				accessToken: 'token',
				expiresAt: String(expiresAt),
			})
		);
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded?.expiresAt).toBe(expiresAt);
	});

	it('normalizes ISO date string expiresAt on load', () => {
		const storage = createMockStorage();
		const expiresAt = Date.now() + 3600000;
		const isoDate = new Date(expiresAt).toISOString();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
			JSON.stringify({
				accessToken: 'token',
				expiresAt: isoDate,
			})
		);
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded?.expiresAt).toBe(expiresAt);
	});

	it('normalizes invalid string expiresAt to null on load', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
			JSON.stringify({
				accessToken: 'token',
				expiresAt: 'invalid-date',
			})
		);
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded?.expiresAt).toBeNull();
	});
});

describe('createAuthTokenStorage - token expiration normalization invalid numbers', () => {
	it('normalizes non-finite numeric expiresAt to null on load', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
			JSON.stringify({
				accessToken: 'token',
				expiresAt: Infinity,
			})
		);
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded?.expiresAt).toBeNull();
	});

	it('normalizes NaN expiresAt to null on load', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
			JSON.stringify({
				accessToken: 'token',
				expiresAt: Number.NaN,
			})
		);
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded?.expiresAt).toBeNull();
	});
});

describe('createAuthTokenStorage - SSR safety', () => {
	it('handles storage.getItem returning null (SSR scenario)', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
		const tokenStorage = createAuthTokenStorage(storage);

		const loaded = tokenStorage.loadTokens();

		expect(loaded).toBeNull();
		expect(storage.getItem).toHaveBeenCalledWith(DEFAULT_KEY);
	});

	it('handles storage.setItem failure gracefully (SSR scenario)', () => {
		const storage = createMockStorage();
		(storage.setItem as ReturnType<typeof vi.fn>).mockReturnValue(false);
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens = createTokens();

		const result = tokenStorage.saveTokens(tokens);

		expect(result).toBe(false);
	});

	it('handles storage.removeItem failure gracefully (SSR scenario)', () => {
		const storage = createMockStorage();
		(storage.removeItem as ReturnType<typeof vi.fn>).mockReturnValue(false);
		const tokenStorage = createAuthTokenStorage(storage);

		const result = tokenStorage.clearTokens();

		expect(result).toBe(false);
	});

	it('handles JSON parse errors gracefully and clears invalid data', () => {
		const storage = createMockStorage();
		(storage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('{invalid json}');
		const tokenStorage = createAuthTokenStorage(storage);
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const loaded = tokenStorage.loadTokens();

		expect(loaded).toBeNull();
		expect(storage.removeItem).toHaveBeenCalledWith(DEFAULT_KEY);
		consoleWarnSpy.mockRestore();
	});

	it('works correctly with MockStorageAdapter (simulating browser storage)', () => {
		const storage = new MockStorageAdapter();
		const tokenStorage = createAuthTokenStorage(storage);
		const tokens = createTokens();

		// Save tokens
		const saveResult = tokenStorage.saveTokens(tokens);
		expect(saveResult).toBe(true);

		// Load tokens
		const loaded = tokenStorage.loadTokens();
		expect(loaded).toEqual(tokens);

		// Clear tokens
		const clearResult = tokenStorage.clearTokens();
		expect(clearResult).toBe(true);

		// Verify cleared
		const afterClear = tokenStorage.loadTokens();
		expect(afterClear).toBeNull();
	});
});
