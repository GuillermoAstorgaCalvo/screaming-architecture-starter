import { normalizeExpiresAt } from '@core/auth/authTokenStorage';
import { describe, expect, it } from 'vitest';

describe('normalizeExpiresAt - undefined and null handling', () => {
	it('returns undefined when value is undefined', () => {
		expect(normalizeExpiresAt(undefined)).toBeUndefined();
	});

	it('returns null when value is null', () => {
		expect(normalizeExpiresAt(null)).toBeNull();
	});
});

describe('normalizeExpiresAt - number handling', () => {
	it('returns the number when it is finite', () => {
		const value = Date.now();
		expect(normalizeExpiresAt(value)).toBe(value);
	});

	it('returns null when number is Infinity', () => {
		expect(normalizeExpiresAt(Infinity)).toBeNull();
	});

	it('returns null when number is -Infinity', () => {
		expect(normalizeExpiresAt(-Infinity)).toBeNull();
	});

	it('returns null when number is NaN', () => {
		expect(normalizeExpiresAt(Number.NaN)).toBeNull();
	});
});

describe('normalizeExpiresAt - string handling', () => {
	it('returns numeric value when string is a valid number', () => {
		const value = String(Date.now());
		expect(normalizeExpiresAt(value)).toBe(Number(value));
	});

	it('returns parsed date when string is a valid ISO date', () => {
		const date = new Date();
		const isoString = date.toISOString();
		expect(normalizeExpiresAt(isoString)).toBe(date.getTime());
	});

	it('returns parsed date when string is a valid date string', () => {
		const date = new Date('2024-01-01T00:00:00Z');
		expect(normalizeExpiresAt('2024-01-01T00:00:00Z')).toBe(date.getTime());
	});

	it('returns null when string is empty', () => {
		expect(normalizeExpiresAt('')).toBeNull();
	});

	it('returns null when string is whitespace only', () => {
		expect(normalizeExpiresAt('   ')).toBeNull();
	});

	it('returns null when string is not a valid number or date', () => {
		expect(normalizeExpiresAt('invalid')).toBeNull();
	});

	it('trims whitespace before parsing', () => {
		const value = String(Date.now());
		expect(normalizeExpiresAt(`  ${value}  `)).toBe(Number(value));
	});
});

describe('normalizeExpiresAt - other types handling', () => {
	it('returns null for boolean values', () => {
		expect(normalizeExpiresAt(true)).toBeNull();
		expect(normalizeExpiresAt(false)).toBeNull();
	});

	it('returns null for object values', () => {
		expect(normalizeExpiresAt({})).toBeNull();
		expect(normalizeExpiresAt({ expiresAt: 123 })).toBeNull();
	});

	it('returns null for array values', () => {
		expect(normalizeExpiresAt([])).toBeNull();
		expect(normalizeExpiresAt([123])).toBeNull();
	});
});
