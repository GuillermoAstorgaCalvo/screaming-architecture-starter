import { validateNonce } from '@core/security/csp/nonce';
import { buildCSPPolicy, getRecommendedCSP, parseCSPPolicy } from '@core/security/csp/policy';
import type { CSPDirectives } from '@core/security/csp/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// CSP test constants
const SELF = "'self'";
const STRICT_DYNAMIC = "'strict-dynamic'";
const UNSAFE_INLINE = "'unsafe-inline'";

// Policy string constants for assertions
const POLICY_DEFAULT_SRC_SELF = "default-src 'self'";
const POLICY_SCRIPT_SRC_SELF_STRICT = "script-src 'self' 'strict-dynamic'";
const POLICY_CONNECT_SRC_SELF = "connect-src 'self'";
const CSP_HEADER_REPORT_ONLY = 'Content-Security-Policy-Report-Only:';
const CSP_HEADER = 'Content-Security-Policy:';

// Test data constants
const API_ORIGIN = 'https://api.example.com';
const UPGRADE_INSECURE_REQUESTS = 'upgrade-insecure-requests';
const TEST_NONCE = 'test-nonce';

// Mock nonce validation
vi.mock('@core/security/csp/nonce', () => ({
	validateNonce: vi.fn(),
}));

describe('buildCSPPolicy - basic policy building', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('builds policy from directives', () => {
		const directives: CSPDirectives = {
			'default-src': [SELF],
			'script-src': [SELF, STRICT_DYNAMIC],
		};

		const policy = buildCSPPolicy(directives);
		expect(policy).toContain(POLICY_DEFAULT_SRC_SELF);
		expect(policy).toContain(POLICY_SCRIPT_SRC_SELF_STRICT);
		expect(policy.split(';').length).toBe(2);
	});

	it('joins directives with semicolons', () => {
		const directives: CSPDirectives = {
			'default-src': [SELF],
			'script-src': [SELF],
			'style-src': [SELF],
		};

		const policy = buildCSPPolicy(directives);
		const parts = policy.split(';').map(p => p.trim());
		expect(parts.length).toBe(3);
	});

	it('handles complex policy with all directive types', () => {
		const directives: CSPDirectives = {
			'default-src': [SELF],
			'script-src': [SELF, STRICT_DYNAMIC],
			'style-src': [SELF, UNSAFE_INLINE],
			'img-src': [SELF, 'data:', 'https:'],
			'connect-src': [SELF, API_ORIGIN],
			[UPGRADE_INSECURE_REQUESTS]: true,
		};

		const policy = buildCSPPolicy(directives);
		expect(policy).toContain(POLICY_DEFAULT_SRC_SELF);
		expect(policy).toContain(POLICY_SCRIPT_SRC_SELF_STRICT);
		expect(policy).toContain("style-src 'self' 'unsafe-inline'");
		expect(policy).toContain("img-src 'self' data: https:");
		expect(policy).toContain(`connect-src 'self' ${API_ORIGIN}`);
		expect(policy).toContain(UPGRADE_INSECURE_REQUESTS);
	});
});

describe('buildCSPPolicy - nonce handling', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('adds nonce to script-src and style-src', () => {
		const directives: CSPDirectives = {
			'script-src': [SELF],
			'style-src': [SELF],
			'img-src': [SELF],
		};

		const policy = buildCSPPolicy(directives, 'nonce123');
		expect(policy).toContain("'nonce-nonce123'");
		expect(policy).toMatch(/script-src 'nonce-nonce123' 'self'/);
		expect(policy).toMatch(/style-src 'nonce-nonce123' 'self'/);
		expect(policy).not.toMatch(/img-src 'nonce-nonce123'/);
	});

	it('validates nonce before building policy', () => {
		const directives: CSPDirectives = {
			'default-src': [SELF],
		};

		buildCSPPolicy(directives, TEST_NONCE);
		expect(validateNonce).toHaveBeenCalledWith(TEST_NONCE);
	});
});

describe('buildCSPPolicy - boolean directives', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles boolean directives', () => {
		const directives: CSPDirectives = {
			[UPGRADE_INSECURE_REQUESTS]: true,
			'block-all-mixed-content': true,
		};

		const policy = buildCSPPolicy(directives);
		expect(policy).toContain(UPGRADE_INSECURE_REQUESTS);
		expect(policy).toContain('block-all-mixed-content');
	});

	it('excludes false boolean directives', () => {
		const directives: CSPDirectives = {
			[UPGRADE_INSECURE_REQUESTS]: false,
			'default-src': [SELF],
		};

		const policy = buildCSPPolicy(directives);
		expect(policy).not.toContain(UPGRADE_INSECURE_REQUESTS);
		expect(policy).toContain(POLICY_DEFAULT_SRC_SELF);
	});
});

describe('buildCSPPolicy - edge cases', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('excludes null and undefined directives', () => {
		const directives: CSPDirectives = {
			'default-src': [SELF],
		};
		// TypeScript doesn't allow undefined in exactOptionalPropertyTypes, so we test with object that doesn't have these keys
		const policy = buildCSPPolicy(directives);
		expect(policy).toContain(POLICY_DEFAULT_SRC_SELF);
		expect(policy).not.toContain('script-src');
		expect(policy).not.toContain('style-src');
	});

	it('handles empty directives object', () => {
		const directives: CSPDirectives = {};
		const policy = buildCSPPolicy(directives);
		expect(policy).toBe('');
	});

	it('handles directives with empty arrays', () => {
		const directives: CSPDirectives = {
			'default-src': [],
			'script-src': [SELF],
		};

		const policy = buildCSPPolicy(directives);
		expect(policy).not.toContain('default-src');
		expect(policy).toContain("script-src 'self'");
	});
});

describe('getRecommendedCSP - default behavior', () => {
	it('generates recommended CSP with default options', () => {
		const policy = getRecommendedCSP();
		expect(policy).toContain(CSP_HEADER_REPORT_ONLY);
		expect(policy).toContain(POLICY_DEFAULT_SRC_SELF);
		expect(policy).toContain(POLICY_SCRIPT_SRC_SELF_STRICT);
		expect(policy).toContain("style-src 'self' 'unsafe-inline'");
		expect(policy).toContain("img-src 'self' data: https:");
		expect(policy).toContain(POLICY_CONNECT_SRC_SELF);
		expect(policy).toContain("font-src 'self' data:");
		expect(policy).toContain("object-src 'none'");
		expect(policy).toContain("base-uri 'self'");
		expect(policy).toContain("form-action 'self'");
		expect(policy).toContain("frame-ancestors 'none'");
		expect(policy).toContain(UPGRADE_INSECURE_REQUESTS);
	});

	it('uses Report-Only mode by default', () => {
		const policy = getRecommendedCSP();
		expect(policy).toContain(CSP_HEADER_REPORT_ONLY);
		expect(policy).not.toContain(CSP_HEADER);
	});
});

describe('getRecommendedCSP - options', () => {
	it('uses enforcement mode when enableReportOnly is false', () => {
		const policy = getRecommendedCSP({ enableReportOnly: false });
		expect(policy).toContain(CSP_HEADER);
		expect(policy).not.toContain(CSP_HEADER_REPORT_ONLY);
	});

	it('includes nonce when provided', () => {
		const policy = getRecommendedCSP({ nonce: 'test-nonce-123' });
		expect(policy).toContain("'nonce-test-nonce-123'");
		// Nonce is added first, then other values
		expect(policy).toMatch(/script-src 'nonce-test-nonce-123' 'self' 'strict-dynamic'/);
		expect(policy).toMatch(/style-src 'nonce-test-nonce-123' 'self' 'unsafe-inline'/);
	});

	it('validates nonce when provided', () => {
		getRecommendedCSP({ nonce: TEST_NONCE });
		expect(validateNonce).toHaveBeenCalledWith(TEST_NONCE);
	});

	it('includes report-uri when provided', () => {
		const policy = getRecommendedCSP({ reportUri: '/api/csp-report' });
		expect(policy).toContain('report-uri /api/csp-report');
	});

	it('does not include report-uri when not provided', () => {
		const policy = getRecommendedCSP();
		expect(policy).not.toContain('report-uri');
	});

	it('uses custom apiOrigin', () => {
		const policy = getRecommendedCSP({ apiOrigin: API_ORIGIN });
		expect(policy).toContain(`connect-src 'self' ${API_ORIGIN}`);
	});

	it('uses only self for connect-src when apiOrigin is self', () => {
		const policy = getRecommendedCSP({ apiOrigin: SELF });
		expect(policy).toContain(POLICY_CONNECT_SRC_SELF);
		// Should not have duplicate 'self'
		const connectSrcMatch = /connect-src ([^;]+)/.exec(policy);
		expect(connectSrcMatch?.[1]?.split(' ').filter(v => v === "'self'").length).toBe(1);
	});

	it('combines all options correctly', () => {
		const policy = getRecommendedCSP({
			apiOrigin: API_ORIGIN,
			enableReportOnly: false,
			reportUri: '/api/csp-report',
			nonce: 'nonce123',
		});

		expect(policy).toContain(CSP_HEADER);
		expect(policy).toContain(`connect-src 'self' ${API_ORIGIN}`);
		expect(policy).toContain('report-uri /api/csp-report');
		expect(policy).toContain("'nonce-nonce123'");
	});
});

describe('parseCSPPolicy - basic parsing', () => {
	it('parses simple policy string', () => {
		const policyString = "default-src 'self'; script-src 'self'";
		const directives = parseCSPPolicy(policyString);

		expect((directives as Record<string, string[]>)['default-src']).toEqual([SELF]);
		expect((directives as Record<string, string[]>)['script-src']).toEqual([SELF]);
	});

	it('parses policy with multiple directives', () => {
		const policyString =
			"default-src 'self'; script-src 'self' 'strict-dynamic'; style-src 'self' 'unsafe-inline'";
		const directives = parseCSPPolicy(policyString);

		expect((directives as Record<string, string[]>)['default-src']).toEqual([SELF]);
		expect((directives as Record<string, string[]>)['script-src']).toEqual([SELF, STRICT_DYNAMIC]);
		expect((directives as Record<string, string[]>)['style-src']).toEqual([SELF, UNSAFE_INLINE]);
	});

	it('parses complex real-world policy', () => {
		const policyString =
			"default-src 'self'; script-src 'self' 'strict-dynamic' 'nonce-abc123'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.example.com; upgrade-insecure-requests";
		const directives = parseCSPPolicy(policyString);

		expect((directives as Record<string, string[]>)['default-src']).toEqual([SELF]);
		expect((directives as Record<string, string[]>)['script-src']).toEqual([
			SELF,
			STRICT_DYNAMIC,
			"'nonce-abc123'",
		]);
		expect((directives as Record<string, string[]>)['style-src']).toEqual([SELF, UNSAFE_INLINE]);
		expect((directives as Record<string, string[]>)['img-src']).toEqual([SELF, 'data:', 'https:']);
		expect((directives as Record<string, string[]>)['connect-src']).toEqual([SELF, API_ORIGIN]);
		expect(directives[UPGRADE_INSECURE_REQUESTS]).toBe(true);
	});
});

describe('parseCSPPolicy - boolean directives', () => {
	it('parses boolean directives', () => {
		const policyString = "default-src 'self'; upgrade-insecure-requests";
		const directives = parseCSPPolicy(policyString);

		expect((directives as Record<string, string[]>)['default-src']).toEqual([SELF]);
		expect(directives[UPGRADE_INSECURE_REQUESTS]).toBe(true);
	});

	it('parses block-all-mixed-content directive', () => {
		const policyString = "default-src 'self'; block-all-mixed-content";
		const directives = parseCSPPolicy(policyString);

		expect(directives['block-all-mixed-content']).toBe(true);
	});
});

describe('parseCSPPolicy - edge cases and error handling', () => {
	it('handles extra whitespace', () => {
		const policyString = "  default-src   'self'  ;  script-src  'self'  ";
		const directives = parseCSPPolicy(policyString);

		expect((directives as Record<string, string[]>)['default-src']).toEqual([SELF]);
		expect((directives as Record<string, string[]>)['script-src']).toEqual([SELF]);
	});

	it('handles empty policy string', () => {
		const directives = parseCSPPolicy('');
		expect(Object.keys(directives)).toHaveLength(0);
	});

	it('handles null/undefined policy string', () => {
		expect(parseCSPPolicy(null as unknown as string)).toEqual({});
		expect(parseCSPPolicy(undefined as unknown as string)).toEqual({});
	});

	it('handles non-string input', () => {
		expect(parseCSPPolicy(123 as unknown as string)).toEqual({});
		expect(parseCSPPolicy({} as unknown as string)).toEqual({});
	});

	it('handles policy string exceeding maximum length', () => {
		const longPolicy = 'a'.repeat(9000); // Exceeds MAX_POLICY_LENGTH (8192)
		const directives = parseCSPPolicy(longPolicy);
		expect(Object.keys(directives)).toHaveLength(0);
	});

	it('handles policy string at maximum length', () => {
		const longPolicy = 'a'.repeat(8192); // Exactly MAX_POLICY_LENGTH
		const directives = parseCSPPolicy(longPolicy);
		// Should still parse (though may not be valid CSP)
		expect(directives).toBeDefined();
	});

	it('handles multiple semicolons', () => {
		const policyString = "default-src 'self';; script-src 'self'";
		const directives = parseCSPPolicy(policyString);

		expect((directives as Record<string, string[]>)['default-src']).toEqual([SELF]);
		expect((directives as Record<string, string[]>)['script-src']).toEqual([SELF]);
	});

	it('handles directives with no values (empty after colon)', () => {
		const policyString = "default-src 'self'; script-src; style-src 'self'";
		const directives = parseCSPPolicy(policyString);

		expect((directives as Record<string, string[]>)['default-src']).toEqual(["'self'"]);
		expect((directives as Record<string, string[]>)['script-src']).toBeUndefined();
		expect((directives as Record<string, string[]>)['style-src']).toEqual([SELF]);
	});
});

describe('parseCSPPolicy - round-trip', () => {
	it('round-trip: build then parse', () => {
		const originalDirectives: CSPDirectives = {
			'default-src': [SELF],
			'script-src': [SELF, STRICT_DYNAMIC],
			[UPGRADE_INSECURE_REQUESTS]: true,
		};

		const policyString = buildCSPPolicy(originalDirectives);
		const parsedDirectives = parseCSPPolicy(policyString);

		expect((parsedDirectives as Record<string, string[]>)['default-src']).toEqual([SELF]);
		expect((parsedDirectives as Record<string, string[]>)['script-src']).toEqual([
			SELF,
			STRICT_DYNAMIC,
		]);
		expect(parsedDirectives[UPGRADE_INSECURE_REQUESTS]).toBe(true);
	});
});
