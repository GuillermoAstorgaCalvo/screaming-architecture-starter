/**
 * Tests for common layout types
 *
 * Tests the ARIA_LABEL constant:
 * - Constant value
 * - Type safety
 * - Usage in type definitions
 */

import { ARIA_LABEL } from '@src-types/ui/layout/common';
import { describe, expect, it } from 'vitest';

describe('ARIA_LABEL constant', () => {
	it('should be a string constant', () => {
		expect(typeof ARIA_LABEL).toBe('string');
	});

	it('should equal "aria-label"', () => {
		expect(ARIA_LABEL).toBe('aria-label');
	});

	it('should be a const assertion', () => {
		// TypeScript const assertion ensures the value is readonly
		const value: typeof ARIA_LABEL = 'aria-label';
		expect(value).toBe(ARIA_LABEL);
	});

	it('should be usable in type definitions', () => {
		// Test that it can be used as a property key
		interface TestType {
			[ARIA_LABEL]: string;
		}

		const testObj: TestType = {
			[ARIA_LABEL]: 'Test label',
		};

		expect(testObj[ARIA_LABEL]).toBe('Test label');
		expect(testObj['aria-label']).toBe('Test label');
	});

	it('should be usable in object property access', () => {
		const testObj = {
			[ARIA_LABEL]: 'Accessible label',
		};

		expect(testObj[ARIA_LABEL]).toBe('Accessible label');
	});

	it('should prevent string literal duplication', () => {
		// The constant should be used instead of duplicating the string
		const label1 = ARIA_LABEL;
		const label2 = ARIA_LABEL;

		expect(label1).toBe(label2);
		expect(label1).toBe('aria-label');
	});

	it('should be immutable', () => {
		// Since it's a const, it cannot be reassigned
		// This is a compile-time check, but we can verify the value
		expect(ARIA_LABEL).toBe('aria-label');
	});
});
