import { applySizeConstraints } from '@core/ui/utilities/resizable/helpers/useResizable.helpers';
import { describe, expect, it } from 'vitest';

describe('useResizable.helpers - applySizeConstraints', () => {
	it('returns size when within min and max bounds', () => {
		expect(applySizeConstraints(200, 50, 500)).toBe(200);
		expect(applySizeConstraints(100, 50, 500)).toBe(100);
		expect(applySizeConstraints(400, 50, 500)).toBe(400);
	});

	it('enforces minSize when size is below minimum', () => {
		expect(applySizeConstraints(30, 50, 500)).toBe(50);
		expect(applySizeConstraints(0, 50, 500)).toBe(50);
		expect(applySizeConstraints(-10, 50, 500)).toBe(50);
	});

	it('enforces maxSize when size exceeds maximum', () => {
		expect(applySizeConstraints(600, 50, 500)).toBe(500);
		expect(applySizeConstraints(1000, 50, 500)).toBe(500);
	});

	it('handles undefined maxSize (no upper bound)', () => {
		expect(applySizeConstraints(200, 50, undefined)).toBe(200);
		expect(applySizeConstraints(1000, 50, undefined)).toBe(1000);
		expect(applySizeConstraints(30, 50, undefined)).toBe(50); // Still enforces min
	});

	it('handles edge case where size equals minSize', () => {
		expect(applySizeConstraints(50, 50, 500)).toBe(50);
	});

	it('handles edge case where size equals maxSize', () => {
		expect(applySizeConstraints(500, 50, 500)).toBe(500);
	});

	it('handles edge case where minSize equals maxSize', () => {
		expect(applySizeConstraints(100, 100, 100)).toBe(100);
		expect(applySizeConstraints(50, 100, 100)).toBe(100);
		expect(applySizeConstraints(150, 100, 100)).toBe(100);
	});

	it('handles size below minSize with undefined maxSize', () => {
		expect(applySizeConstraints(25, 50, undefined)).toBe(50);
	});

	it('handles decimal values', () => {
		expect(applySizeConstraints(123.456, 50, 500)).toBe(123.456);
		expect(applySizeConstraints(45.123, 50, 500)).toBe(50);
		expect(applySizeConstraints(550.789, 50, 500)).toBe(500);
	});
});
