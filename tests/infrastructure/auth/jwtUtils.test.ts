import { decodeJwt, extractNumericClaim } from '@infra/auth/jwtUtils';
import type { TokenPayload } from '@src-types/api/auth';
import { describe, expect, it } from 'vitest';

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

describe('decodeJwt - valid tokens', () => {
	it('decodes a valid JWT token with all parts', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const payload: TokenPayload = {
			sub: 'user123',
			username: 'testuser',
			email: 'test@example.com',
			exp: 1234567890,
			iat: 1234567890 - 3600,
		};
		const token = createJwtToken(header, payload, 'signature123');

		const result = decodeJwt<TokenPayload>(token);

		expect(result).not.toBeNull();
		expect(result?.header).toEqual(header);
		expect(result?.payload).toEqual(payload);
		expect(result?.signature).toBe('signature123');
	});

	it('decodes a JWT token without signature', () => {
		const header = { alg: 'none', typ: 'JWT' };
		const payload = { sub: 'user123' };
		const headerB64 = btoa(JSON.stringify(header)).replaceAll('+', '-').replaceAll('/', '_');
		const payloadB64 = btoa(JSON.stringify(payload)).replaceAll('+', '-').replaceAll('/', '_');
		const token = `${headerB64}.${payloadB64}`;

		const result = decodeJwt(token);

		expect(result).not.toBeNull();
		expect(result?.header).toEqual(header);
		expect(result?.payload).toEqual(payload);
		expect(result?.signature).toBeUndefined();
	});
});

describe('decodeJwt - invalid tokens', () => {
	it('returns null for token with missing header segment', () => {
		const payload = { sub: 'user123' };
		const token = `.${btoa(JSON.stringify(payload))}.signature`;

		const result = decodeJwt(token);

		expect(result).toBeNull();
	});

	it('returns null for token with missing payload segment', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const token = `${btoa(JSON.stringify(header))}..signature`;

		const result = decodeJwt(token);

		expect(result).toBeNull();
	});

	it('returns null for token with invalid base64 header', () => {
		const payload = { sub: 'user123' };
		const token = `invalid-base64.${btoa(JSON.stringify(payload))}.signature`;

		const result = decodeJwt(token);

		expect(result).toBeNull();
	});

	it('returns null for token with invalid base64 payload', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const token = `${btoa(JSON.stringify(header))}.invalid-base64.signature`;

		const result = decodeJwt(token);

		expect(result).toBeNull();
	});

	it('returns null for token with invalid JSON in header', () => {
		const invalidJson = btoa('{invalid json}').replaceAll('+', '-').replaceAll('/', '_');
		const payload = { sub: 'user123' };
		const token = `${invalidJson}.${btoa(JSON.stringify(payload))}.signature`;

		const result = decodeJwt(token);

		expect(result).toBeNull();
	});

	it('returns null for token with invalid JSON in payload', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const invalidJson = btoa('{invalid json}').replaceAll('+', '-').replaceAll('/', '_');
		const token = `${btoa(JSON.stringify(header))}.${invalidJson}.signature`;

		const result = decodeJwt(token);

		expect(result).toBeNull();
	});
});

describe('decodeJwt - edge cases', () => {
	it('handles base64url padding correctly', () => {
		const header = { alg: 'HS256' };
		const payload = { sub: 'user' };
		// Create token with padding needed
		const headerB64 = btoa(JSON.stringify(header)).replaceAll('+', '-').replaceAll('/', '_');
		const payloadB64 = btoa(JSON.stringify(payload)).replaceAll('+', '-').replaceAll('/', '_');
		const token = `${headerB64}.${payloadB64}.signature`;

		const result = decodeJwt(token);

		expect(result).not.toBeNull();
		expect(result?.header).toEqual(header);
		expect(result?.payload).toEqual(payload);
	});

	it('handles empty payload object', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const payload = {};
		const token = createJwtToken(header, payload);

		const result = decodeJwt(token);

		expect(result).not.toBeNull();
		expect(result?.payload).toEqual({});
	});

	it('handles payload with nested objects', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const payload = {
			sub: 'user123',
			metadata: {
				role: 'admin',
				permissions: ['read', 'write'],
			},
		};
		const token = createJwtToken(header, payload);

		const result = decodeJwt(token);

		expect(result).not.toBeNull();
		expect(result?.payload).toEqual(payload);
	});

	it('handles token with only two segments (no signature)', () => {
		const header = { alg: 'none', typ: 'JWT' };
		const payload = { sub: 'user123' };
		const headerB64 = btoa(JSON.stringify(header)).replaceAll('+', '-').replaceAll('/', '_');
		const payloadB64 = btoa(JSON.stringify(payload)).replaceAll('+', '-').replaceAll('/', '_');
		const token = `${headerB64}.${payloadB64}`;

		const result = decodeJwt(token);

		expect(result).not.toBeNull();
		expect(result?.header).toEqual(header);
		expect(result?.payload).toEqual(payload);
		expect(result?.signature).toBeUndefined();
	});

	it('handles token with empty string signature segment', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const payload = { sub: 'user123' };
		const headerB64 = btoa(JSON.stringify(header)).replaceAll('+', '-').replaceAll('/', '_');
		const payloadB64 = btoa(JSON.stringify(payload)).replaceAll('+', '-').replaceAll('/', '_');
		const token = `${headerB64}.${payloadB64}.`;

		const result = decodeJwt(token);

		expect(result).not.toBeNull();
		expect(result?.header).toEqual(header);
		expect(result?.payload).toEqual(payload);
		expect(result?.signature).toBe('');
	});
});

describe('extractNumericClaim - numeric values', () => {
	it('extracts numeric claim when value is a number', () => {
		const payload = { exp: 1234567890, iat: 1234567890 - 3600 };

		expect(extractNumericClaim(payload, 'exp')).toBe(1234567890);
		expect(extractNumericClaim(payload, 'iat')).toBe(1234567890 - 3600);
	});

	it('extracts numeric claim when value is a finite number', () => {
		const payload = { exp: 1234567890.5 };

		expect(extractNumericClaim(payload, 'exp')).toBe(1234567890.5);
	});
});

describe('extractNumericClaim - missing and invalid values', () => {
	it('returns undefined when claim is missing', () => {
		const payload = { sub: 'user123' };

		expect(extractNumericClaim(payload, 'exp')).toBeUndefined();
		expect(extractNumericClaim(payload, 'iat')).toBeUndefined();
	});

	it('returns null when value is Infinity', () => {
		const payload = { exp: Infinity };

		expect(extractNumericClaim(payload, 'exp')).toBeNull();
	});

	it('returns null when value is -Infinity', () => {
		const payload = { exp: -Infinity };

		expect(extractNumericClaim(payload, 'exp')).toBeNull();
	});

	it('returns null when value is NaN', () => {
		const payload = { exp: Number.NaN };

		expect(extractNumericClaim(payload, 'exp')).toBeNull();
	});
});

describe('extractNumericClaim - string values', () => {
	it('extracts numeric claim when value is a numeric string', () => {
		const payload = { exp: '1234567890', iat: '1234567890' };

		expect(extractNumericClaim(payload, 'exp')).toBe(1234567890);
		expect(extractNumericClaim(payload, 'iat')).toBe(1234567890);
	});

	it('extracts numeric claim when value is a decimal string', () => {
		const payload = { exp: '1234567890.5' };

		expect(extractNumericClaim(payload, 'exp')).toBe(1234567890.5);
	});

	it('extracts numeric claim when value is a date string', () => {
		const date = new Date('2023-01-01T00:00:00Z');
		const timestamp = date.getTime();
		const payload = { exp: date.toISOString() };

		const result = extractNumericClaim(payload, 'exp');
		expect(result).toBe(timestamp);
	});
});

describe('extractNumericClaim - edge cases', () => {
	it('returns null when value is an empty string', () => {
		const payload = { exp: '' };

		expect(extractNumericClaim(payload, 'exp')).toBeNull();
	});

	it('returns null when value is a whitespace-only string', () => {
		const payload = { exp: '   ' };

		expect(extractNumericClaim(payload, 'exp')).toBeNull();
	});

	it('returns null when value is a non-numeric string', () => {
		const payload = { exp: 'not-a-number' };

		expect(extractNumericClaim(payload, 'exp')).toBeNull();
	});

	it('returns null when value is a non-parseable date string', () => {
		const payload = { exp: 'invalid-date' };

		expect(extractNumericClaim(payload, 'exp')).toBeNull();
	});

	it('returns null when value is a boolean', () => {
		const payload = { exp: true };

		expect(extractNumericClaim(payload, 'exp')).toBeNull();
	});

	it('returns null when value is an object', () => {
		const payload = { exp: { nested: 'value' } };

		expect(extractNumericClaim(payload, 'exp')).toBeNull();
	});

	it('returns null when value is an array', () => {
		const payload = { exp: [1, 2, 3] };

		expect(extractNumericClaim(payload, 'exp')).toBeNull();
	});

	it('returns null when value is null', () => {
		const payload = { exp: null };

		expect(extractNumericClaim(payload, 'exp')).toBeNull();
	});

	it('handles zero as a valid numeric claim', () => {
		const payload = { exp: 0, iat: 0 };

		expect(extractNumericClaim(payload, 'exp')).toBe(0);
		expect(extractNumericClaim(payload, 'iat')).toBe(0);
	});

	it('handles negative numbers as valid numeric claims', () => {
		const payload = { exp: -1234567890 };

		expect(extractNumericClaim(payload, 'exp')).toBe(-1234567890);
	});

	it('handles trimmed numeric strings', () => {
		const payload = { exp: '  1234567890  ' };

		expect(extractNumericClaim(payload, 'exp')).toBe(1234567890);
	});

	it('handles various date formats', () => {
		const date1 = new Date('2023-01-01T00:00:00Z');
		const date2 = new Date('2023-12-31T23:59:59Z');

		expect(extractNumericClaim({ exp: date1.toISOString() }, 'exp')).toBe(date1.getTime());
		expect(extractNumericClaim({ exp: date2.toISOString() }, 'exp')).toBe(date2.getTime());
	});
});

describe('decodeJwt - environment compatibility', () => {
	it('uses globalThis.atob when available', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const payload = { sub: 'user123' };
		const token = createJwtToken(header, payload);

		const result = decodeJwt(token);

		expect(result).not.toBeNull();
		expect(result?.header).toEqual(header);
		expect(result?.payload).toEqual(payload);
	});

	it('handles base64url encoding with special characters', () => {
		const header = { alg: 'HS256', typ: 'JWT' };
		const payload = { sub: 'user+test/with=special', name: 'Test User' };
		const token = createJwtToken(header, payload);

		const result = decodeJwt(token);

		expect(result).not.toBeNull();
		expect(result?.payload).toEqual(payload);
	});
});
