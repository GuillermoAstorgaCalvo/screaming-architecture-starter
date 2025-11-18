import { createAuthTokenStorage } from '@core/auth/authTokenStorage';
import type { AuthTokens } from '@core/ports/AuthPort';
import type { StoragePort } from '@core/ports/StoragePort';
import { JwtAuthAdapter } from '@infra/auth/jwtAuthAdapter';
import type { TokenPayload } from '@src-types/api/auth';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Helper to create a valid JWT token string
 */
function createJwtToken(
	header: Record<string, unknown>,
	payload: Record<string, unknown>,
	signature = 'signature'
): string {
	const encodeBase64Url = (obj: Record<string, unknown>): string => {
		const json = JSON.stringify(obj);
		const base64 = btoa(json);
		return base64.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
	};

	return `${encodeBase64Url(header)}.${encodeBase64Url(payload)}.${signature}`;
}

/**
 * Helper to create tokens with expiration
 */
function createTokens(overrides: Partial<AuthTokens> = {}): AuthTokens {
	return {
		accessToken: createJwtToken({ alg: 'HS256', typ: 'JWT' }, { sub: 'user123' }),
		refreshToken: 'refresh-token-456',
		expiresAt: Date.now() + 3600000, // 1 hour from now
		...overrides,
	};
}

/**
 * Helper to create a token with expiration claim
 */
function createTokenWithExpiration(expSeconds: number): string {
	const now = Math.floor(Date.now() / 1000);
	return createJwtToken(
		{ alg: 'HS256', typ: 'JWT' },
		{ sub: 'user123', exp: now + expSeconds, iat: now }
	);
}

const createMockStorage = (): StoragePort => ({
	getItem: vi.fn().mockReturnValue(null),
	setItem: vi.fn().mockReturnValue(true),
	removeItem: vi.fn().mockReturnValue(true),
	clear: vi.fn().mockReturnValue(true),
	getLength: vi.fn().mockReturnValue(0),
	key: vi.fn().mockReturnValue(null),
});

const DEFAULT_STORAGE_KEY = 'app.auth.tokens';

describe('JwtAuthAdapter - constructor', () => {
	it('creates adapter without storage (in-memory only)', () => {
		const adapter = new JwtAuthAdapter();

		expect(adapter.getTokens()).toBeNull();
		expect(adapter.getAccessToken()).toBeNull();
		expect(adapter.getRefreshToken()).toBeNull();
	});

	it('creates adapter with storage', () => {
		const storage = new MockStorageAdapter();
		const adapter = new JwtAuthAdapter({ storage });

		expect(adapter.getTokens()).toBeNull();
	});

	it('creates adapter with custom storage key', () => {
		const storage = new MockStorageAdapter();
		const adapter = new JwtAuthAdapter({ storage, storageKey: 'custom.key' });

		expect(adapter.getTokens()).toBeNull();
	});

	it('creates adapter with default clock skew (30 seconds)', () => {
		const adapter = new JwtAuthAdapter();
		const token = createTokenWithExpiration(25); // Expires in 25 seconds

		// Should be expired due to default 30s clock skew
		expect(adapter.isTokenExpired(token)).toBe(true);
	});

	it('creates adapter with custom clock skew', () => {
		const adapter = new JwtAuthAdapter({ clockSkewSeconds: 10 });
		const token = createTokenWithExpiration(15); // Expires in 15 seconds

		// Should not be expired with 10s clock skew
		expect(adapter.isTokenExpired(token)).toBe(false);
	});

	it('creates adapter with zero clock skew', () => {
		const adapter = new JwtAuthAdapter({ clockSkewSeconds: 0 });
		const token = createTokenWithExpiration(5); // Expires in 5 seconds

		// Should not be expired with 0s clock skew
		expect(adapter.isTokenExpired(token)).toBe(false);
	});

	it('creates adapter with negative clock skew (normalized to 0)', () => {
		const adapter = new JwtAuthAdapter({ clockSkewSeconds: -10 });
		const token = createTokenWithExpiration(5); // Expires in 5 seconds

		// Should not be expired (negative skew normalized to 0)
		expect(adapter.isTokenExpired(token)).toBe(false);
	});

	it('loads tokens from storage on initialization', () => {
		const storage = new MockStorageAdapter();
		const tokens = createTokens();
		const tokenStorage = createAuthTokenStorage(storage);
		tokenStorage.saveTokens(tokens);

		const adapter = new JwtAuthAdapter({ storage });

		expect(adapter.getTokens()).toEqual(tokens);
		expect(adapter.getAccessToken()).toBe(tokens.accessToken);
		expect(adapter.getRefreshToken()).toBe(tokens.refreshToken);
	});
});

describe('JwtAuthAdapter - token storage operations - basic operations', () => {
	let adapter: JwtAuthAdapter;
	let storage: MockStorageAdapter;

	beforeEach(() => {
		storage = new MockStorageAdapter();
		adapter = new JwtAuthAdapter({ storage });
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('sets and retrieves tokens', () => {
		const tokens = createTokens();

		adapter.setTokens(tokens);

		expect(adapter.getTokens()).toEqual(tokens);
		expect(adapter.getAccessToken()).toBe(tokens.accessToken);
		expect(adapter.getRefreshToken()).toBe(tokens.refreshToken);
	});

	it('throws error when setting tokens without accessToken', () => {
		const invalidTokens = { refreshToken: 'refresh' } as unknown as AuthTokens;

		expect(() => adapter.setTokens(invalidTokens)).toThrow(
			'Auth tokens must include a valid access token'
		);
	});

	it('clears tokens', () => {
		const tokens = createTokens();
		adapter.setTokens(tokens);

		adapter.clearTokens();

		expect(adapter.getTokens()).toBeNull();
		expect(adapter.getAccessToken()).toBeNull();
		expect(adapter.getRefreshToken()).toBeNull();
	});

	it('clears tokens from storage', () => {
		const tokens = createTokens();
		adapter.setTokens(tokens);

		adapter.clearTokens();

		const stored = storage.getItem(DEFAULT_STORAGE_KEY);
		expect(stored).toBeNull();
	});
});

describe('JwtAuthAdapter - token storage operations - token normalization', () => {
	let adapter: JwtAuthAdapter;

	beforeEach(() => {
		const storage = new MockStorageAdapter();
		adapter = new JwtAuthAdapter({ storage });
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('normalizes refreshToken to null when omitted', () => {
		const tokens = { accessToken: 'access-token' } as AuthTokens;

		adapter.setTokens(tokens);

		const stored = adapter.getTokens();
		expect(stored?.refreshToken).toBeNull();
	});

	it('normalizes refreshToken to null when explicitly null', () => {
		const tokens = { accessToken: 'access-token', refreshToken: null } as AuthTokens;

		adapter.setTokens(tokens);

		const stored = adapter.getTokens();
		expect(stored?.refreshToken).toBeNull();
	});

	it('normalizes expiresAt from number', () => {
		const tokens = { accessToken: 'token', expiresAt: 1234567890 } as AuthTokens;

		adapter.setTokens(tokens);

		expect(adapter.getTokens()?.expiresAt).toBe(1234567890);
	});

	it('normalizes expiresAt from string', () => {
		const expiresAt = Date.now() + 3600000;
		const tokens = {
			accessToken: 'token',
			expiresAt: expiresAt.toString(),
		} as unknown as AuthTokens;

		adapter.setTokens(tokens);

		expect(adapter.getTokens()?.expiresAt).toBe(expiresAt);
	});

	it('handles tokens without expiresAt', () => {
		const tokens = { accessToken: 'token' } as AuthTokens;

		adapter.setTokens(tokens);

		expect(adapter.getTokens()?.expiresAt).toBeUndefined();
	});
});

describe('JwtAuthAdapter - token storage operations - storage persistence', () => {
	let adapter: JwtAuthAdapter;
	let storage: MockStorageAdapter;

	beforeEach(() => {
		storage = new MockStorageAdapter();
		adapter = new JwtAuthAdapter({ storage });
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('persists tokens to storage', () => {
		const tokens = createTokens();

		adapter.setTokens(tokens);

		const stored = storage.getItem(DEFAULT_STORAGE_KEY);
		expect(stored).not.toBeNull();
		if (stored) {
			const parsed = JSON.parse(stored);
			expect(parsed.accessToken).toBe(tokens.accessToken);
			expect(parsed.refreshToken).toBe(tokens.refreshToken);
			expect(parsed.expiresAt).toBe(tokens.expiresAt);
		}
	});

	it('persists tokens with custom storage key', () => {
		const customStorage = new MockStorageAdapter();
		const customAdapter = new JwtAuthAdapter({
			storage: customStorage,
			storageKey: 'custom.auth.key',
		});
		const tokens = createTokens();

		customAdapter.setTokens(tokens);

		const stored = customStorage.getItem('custom.auth.key');
		expect(stored).not.toBeNull();
	});
});

describe('JwtAuthAdapter - token storage operations - error handling', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('handles storage save failure gracefully', () => {
		const failingStorage = createMockStorage();
		(failingStorage.setItem as ReturnType<typeof vi.fn>).mockReturnValue(false);
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const failingAdapter = new JwtAuthAdapter({ storage: failingStorage });
		const tokens = createTokens();

		failingAdapter.setTokens(tokens);

		expect(consoleSpy).toHaveBeenCalledWith('Failed to persist auth tokens to storage');
		expect(failingAdapter.getTokens()).toEqual(tokens); // Tokens still set in memory

		consoleSpy.mockRestore();
	});
});

describe('JwtAuthAdapter - JWT decoding - basic decoding', () => {
	let adapter: JwtAuthAdapter;

	beforeEach(() => {
		adapter = new JwtAuthAdapter();
	});

	it('decodes valid JWT token', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const payload: TokenPayload = {
			sub: 'user123',
			username: 'testuser',
			email: 'test@example.com',
		};
		const token = createJwtToken(header, payload);

		const decoded = adapter.decode<TokenPayload>(token);

		expect(decoded).not.toBeNull();
		expect(decoded?.header).toEqual(header);
		expect(decoded?.payload).toEqual(payload);
	});

	it('handles JWT token with signature', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const payload = { sub: 'user123' };
		const signature = 'signature123';
		const token = createJwtToken(header, payload, signature);

		const decoded = adapter.decode(token);

		expect(decoded).not.toBeNull();
		expect(decoded?.signature).toBe(signature);
	});

	it('handles JWT token without signature', () => {
		const header = { alg: 'none', typ: 'JWT' };
		const payload = { sub: 'user123' };
		const headerB64 = btoa(JSON.stringify(header)).replaceAll('+', '-').replaceAll('/', '_');
		const payloadB64 = btoa(JSON.stringify(payload)).replaceAll('+', '-').replaceAll('/', '_');
		const token = `${headerB64}.${payloadB64}`;

		const decoded = adapter.decode(token);

		expect(decoded).not.toBeNull();
		expect(decoded?.signature).toBeNull();
	});
});

describe('JwtAuthAdapter - JWT decoding - decoding with claims', () => {
	let adapter: JwtAuthAdapter;

	beforeEach(() => {
		adapter = new JwtAuthAdapter();
	});

	it('decodes JWT token with iat, exp, and nbf claims', () => {
		const now = Math.floor(Date.now() / 1000);
		const header = { alg: 'HS256', typ: 'JWT' };
		const payload = {
			sub: 'user123',
			iat: now - 3600,
			exp: now + 3600,
			nbf: now - 1800,
		};
		const token = createJwtToken(header, payload);

		const decoded = adapter.decode(token);

		expect(decoded).not.toBeNull();
		expect(decoded?.issuedAt).toBe(now - 3600);
		expect(decoded?.expiresAt).toBe(now + 3600);
		expect(decoded?.notBefore).toBe(now - 1800);
	});

	it('decodes JWT token without iat, exp, or nbf claims', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const payload = { sub: 'user123' };
		const token = createJwtToken(header, payload);

		const decoded = adapter.decode(token);

		expect(decoded).not.toBeNull();
		expect(decoded?.issuedAt).toBeUndefined();
		expect(decoded?.expiresAt).toBeUndefined();
		expect(decoded?.notBefore).toBeUndefined();
	});

	it('extracts numeric claims from string values', () => {
		const now = Math.floor(Date.now() / 1000);
		const header = { alg: 'HS256', typ: 'JWT' };
		const payload = {
			sub: 'user123',
			iat: now - 3600,
			exp: now + 3600,
		};
		const token = createJwtToken(header, payload);

		const decoded = adapter.decode(token);

		expect(decoded).not.toBeNull();
		expect(decoded?.issuedAt).toBe(now - 3600);
		expect(decoded?.expiresAt).toBe(now + 3600);
	});
});

describe('JwtAuthAdapter - JWT decoding - error cases', () => {
	let adapter: JwtAuthAdapter;

	beforeEach(() => {
		adapter = new JwtAuthAdapter();
	});

	it('returns null for invalid JWT token', () => {
		const invalidToken = 'not.a.valid.jwt.token';

		const decoded = adapter.decode(invalidToken);

		expect(decoded).toBeNull();
	});

	it('returns null for malformed JWT token', () => {
		const malformedToken = 'header.payload'; // Missing signature

		const decoded = adapter.decode(malformedToken);

		expect(decoded).toBeNull();
	});
});

describe('JwtAuthAdapter - token expiration - basic expiration checks', () => {
	let adapter: JwtAuthAdapter;

	beforeEach(() => {
		adapter = new JwtAuthAdapter({ clockSkewSeconds: 0 });
	});

	it('returns true for null token', () => {
		expect(adapter.isTokenExpired(null)).toBe(true);
	});

	it('returns true when no token is set', () => {
		expect(adapter.isTokenExpired()).toBe(true);
	});

	it('returns false for token that has not expired', () => {
		const token = createTokenWithExpiration(3600); // Expires in 1 hour

		expect(adapter.isTokenExpired(token)).toBe(false);
	});

	it('returns true for token that has expired', () => {
		const token = createTokenWithExpiration(-3600); // Expired 1 hour ago

		expect(adapter.isTokenExpired(token)).toBe(true);
	});

	it('uses stored token when no token parameter provided', () => {
		const token = createTokenWithExpiration(3600);
		adapter.setTokens({ accessToken: token });

		expect(adapter.isTokenExpired()).toBe(false);
	});

	it('uses stored expiresAt when token has no exp claim', () => {
		const expiresAt = Date.now() + 3600000; // 1 hour from now
		const token = createJwtToken({ alg: 'HS256' }, { sub: 'user123' });
		adapter.setTokens({ accessToken: token, expiresAt });

		expect(adapter.isTokenExpired()).toBe(false);
	});

	it('uses token exp claim over stored expiresAt', () => {
		const storedExpiresAt = Date.now() + 7200000; // 2 hours from now
		const token = createTokenWithExpiration(-3600); // Expired 1 hour ago
		adapter.setTokens({ accessToken: token, expiresAt: storedExpiresAt });

		expect(adapter.isTokenExpired()).toBe(true);
	});

	it('returns false when token has no exp claim and no stored expiresAt', () => {
		const token = createJwtToken({ alg: 'HS256' }, { sub: 'user123' });
		adapter.setTokens({ accessToken: token });

		expect(adapter.isTokenExpired()).toBe(false);
	});
});

describe('JwtAuthAdapter - token expiration - clock skew handling', () => {
	it('applies clock skew when checking expiration', () => {
		const skewAdapter = new JwtAuthAdapter({ clockSkewSeconds: 30 });
		const token = createTokenWithExpiration(25); // Expires in 25 seconds

		// Should be expired due to 30s clock skew
		expect(skewAdapter.isTokenExpired(token)).toBe(true);
	});

	it('applies custom clock skew from options', () => {
		const customAdapter = new JwtAuthAdapter({ clockSkewSeconds: 10 });
		const token = createTokenWithExpiration(15); // Expires in 15 seconds

		// Should not be expired with 10s clock skew
		expect(customAdapter.isTokenExpired(token)).toBe(false);
		// But should be expired with 20s clock skew
		expect(customAdapter.isTokenExpired(token, { clockSkewSeconds: 20 })).toBe(true);
	});

	it('normalizes negative clock skew to zero', () => {
		const adapter = new JwtAuthAdapter({ clockSkewSeconds: 0 });
		const token = createTokenWithExpiration(5); // Expires in 5 seconds

		expect(adapter.isTokenExpired(token, { clockSkewSeconds: -10 })).toBe(false);
	});

	it('handles token expiring exactly at current time with clock skew', () => {
		const skewAdapter = new JwtAuthAdapter({ clockSkewSeconds: 30 });
		const token = createTokenWithExpiration(30); // Expires in exactly 30 seconds

		// Should be expired due to clock skew
		expect(skewAdapter.isTokenExpired(token)).toBe(true);
	});

	it('handles token expiring just before clock skew threshold', () => {
		const skewAdapter = new JwtAuthAdapter({ clockSkewSeconds: 30 });
		const token = createTokenWithExpiration(31); // Expires in 31 seconds

		// Should not be expired (31s > 30s clock skew)
		expect(skewAdapter.isTokenExpired(token)).toBe(false);
	});
});

describe('JwtAuthAdapter - token change listeners - basic listener functionality', () => {
	let adapter: JwtAuthAdapter;

	beforeEach(() => {
		adapter = new JwtAuthAdapter();
	});

	it('notifies listeners when tokens are set', () => {
		const listener = vi.fn();
		adapter.subscribe(listener);
		const tokens = createTokens();

		adapter.setTokens(tokens);

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith(tokens);
	});

	it('notifies listeners when tokens are cleared', () => {
		const listener = vi.fn();
		adapter.subscribe(listener);
		adapter.setTokens(createTokens());

		adapter.clearTokens();

		expect(listener).toHaveBeenCalledTimes(2); // Once for set, once for clear
		expect(listener).toHaveBeenLastCalledWith(null);
	});

	it('notifies multiple listeners', () => {
		const listener1 = vi.fn();
		const listener2 = vi.fn();
		adapter.subscribe(listener1);
		adapter.subscribe(listener2);
		const tokens = createTokens();

		adapter.setTokens(tokens);

		expect(listener1).toHaveBeenCalledWith(tokens);
		expect(listener2).toHaveBeenCalledWith(tokens);
	});

	it('unsubscribes listener', () => {
		const listener = vi.fn();
		const unsubscribe = adapter.subscribe(listener);
		adapter.setTokens(createTokens());

		unsubscribe();
		adapter.setTokens(createTokens());

		expect(listener).toHaveBeenCalledTimes(1); // Only first setTokens call
	});
});

describe('JwtAuthAdapter - token change listeners - advanced listener scenarios', () => {
	let adapter: JwtAuthAdapter;

	beforeEach(() => {
		adapter = new JwtAuthAdapter();
	});

	it('handles listener errors gracefully', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const errorListener = vi.fn(() => {
			throw new Error('Listener error');
		});
		const normalListener = vi.fn();
		adapter.subscribe(errorListener);
		adapter.subscribe(normalListener);
		const tokens = createTokens();

		adapter.setTokens(tokens);

		expect(consoleSpy).toHaveBeenCalledWith(
			'Auth token listener threw an error',
			expect.any(Error)
		);
		expect(normalListener).toHaveBeenCalledWith(tokens); // Other listeners still called

		consoleSpy.mockRestore();
	});

	it('allows multiple subscriptions and unsubscriptions', () => {
		const listener1 = vi.fn();
		const listener2 = vi.fn();
		const unsubscribe1 = adapter.subscribe(listener1);
		const unsubscribe2 = adapter.subscribe(listener2);
		const tokens = createTokens();

		adapter.setTokens(tokens);
		expect(listener1).toHaveBeenCalledTimes(1);
		expect(listener2).toHaveBeenCalledTimes(1);

		unsubscribe1();
		adapter.setTokens(createTokens());
		expect(listener1).toHaveBeenCalledTimes(1); // No longer called
		expect(listener2).toHaveBeenCalledTimes(2); // Still called

		unsubscribe2();
		adapter.setTokens(createTokens());
		expect(listener1).toHaveBeenCalledTimes(1); // Still not called
		expect(listener2).toHaveBeenCalledTimes(2); // No longer called
	});
});

describe('JwtAuthAdapter - integration with storage', () => {
	it('persists and loads tokens from storage', () => {
		const storage = new MockStorageAdapter();
		const adapter1 = new JwtAuthAdapter({ storage });
		const tokens = createTokens();

		adapter1.setTokens(tokens);

		// Create new adapter instance to test loading
		const adapter2 = new JwtAuthAdapter({ storage });

		expect(adapter2.getTokens()).toEqual(tokens);
		expect(adapter2.getAccessToken()).toBe(tokens.accessToken);
		expect(adapter2.getRefreshToken()).toBe(tokens.refreshToken);
	});

	it('clears tokens from storage when cleared', () => {
		const storage = new MockStorageAdapter();
		const adapter = new JwtAuthAdapter({ storage });
		adapter.setTokens(createTokens());

		adapter.clearTokens();

		expect(storage.getItem(DEFAULT_STORAGE_KEY)).toBeNull();
	});

	it('works without storage (in-memory only)', () => {
		const adapter = new JwtAuthAdapter();
		const tokens = createTokens();

		adapter.setTokens(tokens);

		expect(adapter.getTokens()).toEqual(tokens);
		// Creating new adapter without storage should not have tokens
		const adapter2 = new JwtAuthAdapter();
		expect(adapter2.getTokens()).toBeNull();
	});
});
