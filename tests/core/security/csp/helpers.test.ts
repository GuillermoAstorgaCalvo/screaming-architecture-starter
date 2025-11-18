import {
	buildDirectiveValue,
	processBooleanDirective,
	processDirective,
	processPolicyPart,
	processValueDirective,
} from '@core/security/csp/helpers';
import type { CSPDirectives } from '@core/security/csp/types';
import { describe, expect, it } from 'vitest';

const DEFAULT_SRC = 'default-src';
const SCRIPT_SRC = 'script-src';
const NONCE_123 = 'nonce123';
const STRICT_DYNAMIC = "'strict-dynamic'";
const UPGRADE_INSECURE_REQUESTS = 'upgrade-insecure-requests';

describe('buildDirectiveValue', () => {
	it('joins values with spaces', () => {
		const result = buildDirectiveValue(DEFAULT_SRC, ["'self'", 'https://example.com']);
		expect(result).toBe("'self' https://example.com");
	});

	it('handles single value', () => {
		const result = buildDirectiveValue(DEFAULT_SRC, ["'self'"]);
		expect(result).toBe("'self'");
	});

	it('handles empty array', () => {
		const result = buildDirectiveValue(DEFAULT_SRC, []);
		expect(result).toBe('');
	});

	it('adds nonce to script-src', () => {
		const result = buildDirectiveValue(SCRIPT_SRC, ["'self'"], 'abc123');
		expect(result).toBe("'nonce-abc123' 'self'");
	});

	it('adds nonce to style-src', () => {
		const result = buildDirectiveValue('style-src', ["'self'"], 'xyz789');
		expect(result).toBe("'nonce-xyz789' 'self'");
	});

	it('does not add nonce to other directives', () => {
		const result = buildDirectiveValue('img-src', ["'self'"], 'abc123');
		expect(result).toBe("'self'");
	});

	it('adds nonce first when provided', () => {
		const result = buildDirectiveValue(SCRIPT_SRC, ["'self'", STRICT_DYNAMIC], NONCE_123);
		expect(result).toBe("'nonce-nonce123' 'self' 'strict-dynamic'");
	});

	it('handles nonce with empty values array', () => {
		const result = buildDirectiveValue(SCRIPT_SRC, [], NONCE_123);
		expect(result).toBe("'nonce-nonce123'");
	});
});

describe('processDirective', () => {
	it('returns null for undefined values', () => {
		expect(processDirective(DEFAULT_SRC, undefined)).toBeNull();
	});

	it('returns null for null values', () => {
		expect(processDirective(DEFAULT_SRC, null)).toBeNull();
	});

	it('returns directive name for boolean true', () => {
		expect(processDirective(UPGRADE_INSECURE_REQUESTS, true)).toBe(UPGRADE_INSECURE_REQUESTS);
	});

	it('returns null for boolean false', () => {
		expect(processDirective(UPGRADE_INSECURE_REQUESTS, false)).toBeNull();
	});

	it('returns null for non-array values', () => {
		expect(processDirective(DEFAULT_SRC, 'string' as unknown as string[])).toBeNull();
		expect(processDirective(DEFAULT_SRC, 123 as unknown as string[])).toBeNull();
		expect(processDirective(DEFAULT_SRC, {} as unknown as string[])).toBeNull();
	});

	it('processes array values correctly', () => {
		const result = processDirective(DEFAULT_SRC, ["'self'", 'https://example.com']);
		expect(result).toBe("default-src 'self' https://example.com");
	});

	it('adds nonce to script-src directive', () => {
		const result = processDirective(SCRIPT_SRC, ["'self'"], NONCE_123);
		expect(result).toBe("script-src 'nonce-nonce123' 'self'");
	});

	it('adds nonce to style-src directive', () => {
		const result = processDirective('style-src', ["'self'"], 'nonce456');
		expect(result).toBe("style-src 'nonce-nonce456' 'self'");
	});

	it('does not add nonce to other directives', () => {
		const result = processDirective('img-src', ["'self'"], NONCE_123);
		expect(result).toBe("img-src 'self'");
	});

	it('returns null for empty array', () => {
		const result = processDirective(DEFAULT_SRC, []);
		expect(result).toBeNull();
	});

	it('handles array with single value', () => {
		const result = processDirective(DEFAULT_SRC, ["'self'"]);
		expect(result).toBe("default-src 'self'");
	});

	it('handles array with multiple values', () => {
		const result = processDirective(SCRIPT_SRC, [
			"'self'",
			STRICT_DYNAMIC,
			'https://cdn.example.com',
		]);
		expect(result).toBe("script-src 'self' 'strict-dynamic' https://cdn.example.com");
	});
});

describe('processBooleanDirective', () => {
	it('sets upgrade-insecure-requests to true', () => {
		const directives: CSPDirectives = {};
		processBooleanDirective(UPGRADE_INSECURE_REQUESTS, directives);
		expect(directives[UPGRADE_INSECURE_REQUESTS]).toBe(true);
	});

	it('sets block-all-mixed-content to true', () => {
		const directives: CSPDirectives = {};
		processBooleanDirective('block-all-mixed-content', directives);
		expect(directives['block-all-mixed-content']).toBe(true);
	});

	it('does not modify directives for other directive names', () => {
		const directives: CSPDirectives = {
			[DEFAULT_SRC]: ["'self'"],
		};
		processBooleanDirective(DEFAULT_SRC, directives);
		expect(directives[DEFAULT_SRC]).toEqual(["'self'"]);
	});

	it('overwrites existing boolean directive', () => {
		const directives: CSPDirectives = {
			[UPGRADE_INSECURE_REQUESTS]: false,
		};
		processBooleanDirective(UPGRADE_INSECURE_REQUESTS, directives);
		expect(directives[UPGRADE_INSECURE_REQUESTS]).toBe(true);
	});
});

describe('processValueDirective', () => {
	it('parses directive with single value', () => {
		const directives: CSPDirectives = {};
		// colonIndex is the index of the first space (11 is the space after "default-src")
		processValueDirective(`${DEFAULT_SRC} 'self'`, 11, directives);
		expect((directives as Record<string, string[]>)[DEFAULT_SRC]).toEqual(["'self'"]);
	});

	it('parses directive with multiple values', () => {
		const directives: CSPDirectives = {};
		// colonIndex is the index of the first space (10 is the space after "script-src")
		processValueDirective("script-src 'self' 'strict-dynamic'", 10, directives);
		expect((directives as Record<string, string[]>)[SCRIPT_SRC]).toEqual([
			"'self'",
			STRICT_DYNAMIC,
		]);
	});

	it('handles multiple spaces between values', () => {
		const directives: CSPDirectives = {};
		// colonIndex is the index of the first space (10 is the space after "script-src")
		processValueDirective("script-src 'self'   'strict-dynamic'", 10, directives);
		expect((directives as Record<string, string[]>)[SCRIPT_SRC]).toEqual([
			"'self'",
			STRICT_DYNAMIC,
		]);
	});

	it('trims whitespace from directive name', () => {
		const directives: CSPDirectives = {};
		processValueDirective(`  ${DEFAULT_SRC}  'self'`, 13, directives);
		expect((directives as Record<string, string[]>)[DEFAULT_SRC]).toEqual(["'self'"]);
	});

	it('handles empty values string', () => {
		const directives: CSPDirectives = {};
		// When values are empty after trimming, directive is not set
		processValueDirective(`${DEFAULT_SRC} `, 11, directives);
		expect((directives as Record<string, string[]>)[DEFAULT_SRC]).toBeUndefined();
	});

	it('filters out empty strings from values', () => {
		const directives: CSPDirectives = {};
		// colonIndex is the index of the first space (10 is the space after "script-src")
		processValueDirective("script-src 'self'  'strict-dynamic'", 10, directives);
		const values = (directives as Record<string, string[]>)[SCRIPT_SRC];
		expect(values).not.toContain('');
		expect(values?.length).toBe(2);
	});

	it('handles colonIndex at start', () => {
		const directives: CSPDirectives = {};
		// colonIndex at 0 means directive name is empty, values start at index 1
		processValueDirective(`${DEFAULT_SRC} 'self'`, 0, directives);
		// When colonIndex is 0, directive name would be empty, so it won't be set
		expect((directives as Record<string, string[]>)[DEFAULT_SRC]).toBeUndefined();
	});

	it('handles colonIndex beyond string length', () => {
		const directives: CSPDirectives = {};
		// When colonIndex is beyond length, directive name is the whole string, values are empty
		processValueDirective(`${DEFAULT_SRC} 'self'`, 100, directives);
		// Values would be empty, so directive is not set
		expect((directives as Record<string, string[]>)[DEFAULT_SRC]).toBeUndefined();
	});

	it('does not set directive when values array is empty', () => {
		const directives: CSPDirectives = {};
		processValueDirective(DEFAULT_SRC, 11, directives);
		expect((directives as Record<string, string[]>)[DEFAULT_SRC]).toBeUndefined();
	});
});

describe('processPolicyPart', () => {
	it('processes boolean directive when no space found', () => {
		const directives: CSPDirectives = {};
		processPolicyPart(UPGRADE_INSECURE_REQUESTS, directives);
		expect(directives[UPGRADE_INSECURE_REQUESTS]).toBe(true);
	});

	it('processes value directive when space found', () => {
		const directives: CSPDirectives = {};
		processPolicyPart(`${DEFAULT_SRC} 'self'`, directives);
		expect((directives as Record<string, string[]>)[DEFAULT_SRC]).toEqual(["'self'"]);
	});

	it('handles directive with space at start', () => {
		const directives: CSPDirectives = {};
		// processPolicyPart finds first space at index 0, so it treats it as boolean directive
		// Actually, indexOf(' ') returns 0, so it would call processValueDirective with colonIndex 0
		processPolicyPart(` ${DEFAULT_SRC} 'self'`, directives);
		// The space at start means the directive name would be empty, so it won't parse correctly
		// This is an edge case - in practice, policies shouldn't start with spaces
		expect((directives as Record<string, string[]>)[DEFAULT_SRC]).toBeUndefined();
	});

	it('handles directive with multiple spaces', () => {
		const directives: CSPDirectives = {};
		processPolicyPart("script-src   'self'   'strict-dynamic'", directives);
		expect((directives as Record<string, string[]>)[SCRIPT_SRC]).toEqual([
			"'self'",
			STRICT_DYNAMIC,
		]);
	});

	it('processes block-all-mixed-content as boolean', () => {
		const directives: CSPDirectives = {};
		processPolicyPart('block-all-mixed-content', directives);
		expect(directives['block-all-mixed-content']).toBe(true);
	});

	it('processes complex value directive', () => {
		const directives: CSPDirectives = {};
		processPolicyPart("script-src 'self' 'strict-dynamic' https://cdn.example.com", directives);
		expect((directives as Record<string, string[]>)[SCRIPT_SRC]).toEqual([
			"'self'",
			STRICT_DYNAMIC,
			'https://cdn.example.com',
		]);
	});
});
