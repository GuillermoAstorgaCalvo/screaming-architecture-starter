import type { AuthTokens } from '@core/ports/AuthPort';
import type { StoragePort } from '@core/ports/StoragePort';
import type { JwtAuthAdapter } from '@infra/auth/jwtAuthAdapter';
import * as jwtUtils from '@infra/auth/jwtUtils';
import type { TokenPayload } from '@src-types/api/auth';
import { expect, vi } from 'vitest';

/**
 * Helper to create a valid JWT token string
 */
export function createJwtToken(
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
export function createTokens(overrides: Partial<AuthTokens> = {}): AuthTokens {
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
export function createTokenWithExpiration(expSeconds: number): string {
	const now = Math.floor(Date.now() / 1000);
	return createJwtToken(
		{ alg: 'HS256', typ: 'JWT' },
		{ sub: 'user123', exp: now + expSeconds, iat: now }
	);
}

export const createMockStorage = (): StoragePort => ({
	getItem: vi.fn().mockReturnValue(null),
	setItem: vi.fn().mockReturnValue(true),
	removeItem: vi.fn().mockReturnValue(true),
	clear: vi.fn().mockReturnValue(true),
	getLength: vi.fn().mockReturnValue(0),
	key: vi.fn().mockReturnValue(null),
});

export const DEFAULT_STORAGE_KEY = 'app.auth.tokens';

/**
 * Helper to create a payload with specific claims
 */
export function createPayloadWithClaims(claims: {
	iat?: number;
	exp?: number;
	nbf?: number;
	sub?: string;
}): Record<string, unknown> {
	return {
		sub: claims.sub ?? 'user123',
		...(claims.iat !== undefined && { iat: claims.iat }),
		...(claims.exp !== undefined && { exp: claims.exp }),
		...(claims.nbf !== undefined && { nbf: claims.nbf }),
	};
}

/**
 * Helper to test decoded token claims
 */
export function expectDecodedClaims(
	decoded: ReturnType<JwtAuthAdapter['decode']>,
	expected: {
		issuedAt?: number;
		expiresAt?: number;
		notBefore?: number;
	}
): void {
	expect(decoded).not.toBeNull();
	if (expected.issuedAt === undefined) {
		expect(decoded?.issuedAt).toBeUndefined();
	} else {
		expect(decoded?.issuedAt).toBe(expected.issuedAt);
	}
	if (expected.expiresAt === undefined) {
		expect(decoded?.expiresAt).toBeUndefined();
	} else {
		expect(decoded?.expiresAt).toBe(expected.expiresAt);
	}
	if (expected.notBefore === undefined) {
		expect(decoded?.notBefore).toBeUndefined();
	} else {
		expect(decoded?.notBefore).toBe(expected.notBefore);
	}
}

/**
 * Helper to test token with iat and exp claims
 */
export function testIatAndExpClaims(adapter: JwtAuthAdapter): void {
	const now = Math.floor(Date.now() / 1000);
	const header = { alg: 'HS256', typ: 'JWT' };
	const payload = createPayloadWithClaims({
		iat: now - 3600,
		exp: now + 3600,
	});
	const token = createJwtToken(header, payload);

	const decoded = adapter.decode(token);

	expectDecodedClaims(decoded, {
		issuedAt: now - 3600,
		expiresAt: now + 3600,
	});
}

/**
 * Helper to test token with iat and nbf claims
 */
export function testIatAndNbfClaims(adapter: JwtAuthAdapter): void {
	const now = Math.floor(Date.now() / 1000);
	const header = { alg: 'HS256', typ: 'JWT' };
	const payload = createPayloadWithClaims({
		iat: now - 3600,
		nbf: now - 1800,
	});
	const token = createJwtToken(header, payload);

	const decoded = adapter.decode(token);

	expectDecodedClaims(decoded, {
		issuedAt: now - 3600,
		notBefore: now - 1800,
	});
}

/**
 * Helper to test token with exp and nbf claims
 */
export function testExpAndNbfClaims(adapter: JwtAuthAdapter): void {
	const now = Math.floor(Date.now() / 1000);
	const header = { alg: 'HS256', typ: 'JWT' };
	const payload = createPayloadWithClaims({
		exp: now + 3600,
		nbf: now - 1800,
	});
	const token = createJwtToken(header, payload);

	const decoded = adapter.decode(token);

	expectDecodedClaims(decoded, {
		expiresAt: now + 3600,
		notBefore: now - 1800,
	});
}

/**
 * Helper to test empty object payload
 */
export function testEmptyObjectPayload(adapter: JwtAuthAdapter): void {
	const token = 'test.token';
	const decodeJwtSpy = vi.spyOn(jwtUtils, 'decodeJwt').mockReturnValue({
		header: { alg: 'HS256', typ: 'JWT' },
		payload: {} as unknown as TokenPayload,
		signature: 'signature',
	});

	const decoded = adapter.decode(token);
	expect(decodeJwtSpy).toHaveBeenCalledWith(token);
	expect(decoded).not.toBeNull();
	expect(decoded?.header).toEqual({ alg: 'HS256', typ: 'JWT' });
	expect(decoded?.payload).toEqual({});
	expect(decoded?.signature).toBe('signature');
	decodeJwtSpy.mockRestore();
}

/**
 * Helper to test token with only iat claim
 */
export function testOnlyIatClaim(adapter: JwtAuthAdapter): void {
	const now = Math.floor(Date.now() / 1000);
	const header = { alg: 'HS256', typ: 'JWT' };
	const payload = createPayloadWithClaims({ iat: now - 3600 });
	const token = createJwtToken(header, payload);

	const decoded = adapter.decode(token);

	expectDecodedClaims(decoded, { issuedAt: now - 3600 });
}

/**
 * Helper to test token with only exp claim
 */
export function testOnlyExpClaim(adapter: JwtAuthAdapter): void {
	const now = Math.floor(Date.now() / 1000);
	const header = { alg: 'HS256', typ: 'JWT' };
	const payload = createPayloadWithClaims({ exp: now + 3600 });
	const token = createJwtToken(header, payload);

	const decoded = adapter.decode(token);

	expectDecodedClaims(decoded, { expiresAt: now + 3600 });
}

/**
 * Helper to test token with only nbf claim
 */
export function testOnlyNbfClaim(adapter: JwtAuthAdapter): void {
	const now = Math.floor(Date.now() / 1000);
	const header = { alg: 'HS256', typ: 'JWT' };
	const payload = createPayloadWithClaims({ nbf: now - 1800 });
	const token = createJwtToken(header, payload);

	const decoded = adapter.decode(token);

	expectDecodedClaims(decoded, { notBefore: now - 1800 });
}

/**
 * Helper to test null/undefined payload
 */
export function testNullUndefinedPayload(adapter: JwtAuthAdapter): void {
	const token = 'test.token';
	// Test null payload
	const decodeJwtSpyNull = vi.spyOn(jwtUtils, 'decodeJwt').mockReturnValue({
		header: { alg: 'HS256', typ: 'JWT' },
		payload: null as unknown as TokenPayload,
		signature: 'signature',
	});

	const decodedNull = adapter.decode(token);
	expect(decodeJwtSpyNull).toHaveBeenCalledWith(token);
	expect(decodedNull).not.toBeNull();
	expect(decodedNull?.header).toEqual({ alg: 'HS256', typ: 'JWT' });
	expect(decodedNull?.signature).toBe('signature');
	decodeJwtSpyNull.mockRestore();

	// Test undefined payload
	const decodeJwtSpyUndef = vi.spyOn(jwtUtils, 'decodeJwt').mockReturnValue({
		header: { alg: 'HS256', typ: 'JWT' },
		payload: undefined as unknown as TokenPayload,
		signature: 'signature',
	});

	const decodedUndef = adapter.decode(token);
	expect(decodeJwtSpyUndef).toHaveBeenCalledWith(token);
	expect(decodedUndef).not.toBeNull();
	expect(decodedUndef?.header).toEqual({ alg: 'HS256', typ: 'JWT' });
	expect(decodedUndef?.signature).toBe('signature');
	decodeJwtSpyUndef.mockRestore();
}

/**
 * Helper to test token with all claims (iat, exp, nbf)
 */
export function testAllClaims(adapter: JwtAuthAdapter): void {
	const now = Math.floor(Date.now() / 1000);
	const header = { alg: 'HS256', typ: 'JWT' };
	const payload = createPayloadWithClaims({
		iat: now - 3600,
		exp: now + 3600,
		nbf: now - 1800,
	});
	const token = createJwtToken(header, payload);

	const decoded = adapter.decode(token);

	expectDecodedClaims(decoded, {
		issuedAt: now - 3600,
		expiresAt: now + 3600,
		notBefore: now - 1800,
	});
}

/**
 * Helper to test token without any claims
 */
export function testNoClaims(adapter: JwtAuthAdapter): void {
	const header = { alg: 'HS256', typ: 'JWT' };
	const payload = createPayloadWithClaims({});
	const token = createJwtToken(header, payload);

	const decoded = adapter.decode(token);

	expectDecodedClaims(decoded, {});
}

/**
 * Helper to test numeric claim extraction
 */
export function testNumericClaimExtraction(adapter: JwtAuthAdapter): void {
	const now = Math.floor(Date.now() / 1000);
	const header = { alg: 'HS256', typ: 'JWT' };
	const payload = createPayloadWithClaims({
		iat: now - 3600,
		exp: now + 3600,
	});
	const token = createJwtToken(header, payload);

	const decoded = adapter.decode(token);

	expect(decoded).not.toBeNull();
	expect(decoded?.issuedAt).toBe(now - 3600);
	expect(decoded?.expiresAt).toBe(now + 3600);
}
