/**
 * Tests for NotificationBell helper functions
 *
 * Tests helper functions:
 * - getIconSizeClasses
 * - getDisplayCount
 * - getButtonClasses
 */

import {
	getButtonClasses,
	getDisplayCount,
	getIconSizeClasses,
} from '@core/ui/feedback/notification-bell/helpers/NotificationBellHelpers';
import type { StandardSize } from '@src-types/ui/base';
import { describe, expect, it } from 'vitest';

describe('NotificationBellHelpers - getIconSizeClasses', () => {
	it('returns correct classes for sm size', () => {
		expect(getIconSizeClasses('sm')).toBe('h-4 w-4');
	});

	it('returns correct classes for md size', () => {
		expect(getIconSizeClasses('md')).toBe('h-5 w-5');
	});

	it('returns correct classes for lg size', () => {
		expect(getIconSizeClasses('lg')).toBe('h-6 w-6');
	});

	it('handles all valid StandardSize values', () => {
		const sizes: StandardSize[] = ['sm', 'md', 'lg'];
		const expectedClasses = ['h-4 w-4', 'h-5 w-5', 'h-6 w-6'];

		for (const [index, size] of sizes.entries()) {
			expect(getIconSizeClasses(size)).toBe(expectedClasses[index]);
		}
	});

	it('returns different classes for different sizes', () => {
		const smClasses = getIconSizeClasses('sm');
		const mdClasses = getIconSizeClasses('md');
		const lgClasses = getIconSizeClasses('lg');

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('returns a string for all sizes', () => {
		expect(typeof getIconSizeClasses('sm')).toBe('string');
		expect(typeof getIconSizeClasses('md')).toBe('string');
		expect(typeof getIconSizeClasses('lg')).toBe('string');
	});
});

describe('NotificationBellHelpers - getDisplayCount', () => {
	it('returns count as string when count is less than maxCount', () => {
		expect(getDisplayCount(0, 99)).toBe('0');
		expect(getDisplayCount(5, 99)).toBe('5');
		expect(getDisplayCount(50, 99)).toBe('50');
		expect(getDisplayCount(98, 99)).toBe('98');
	});

	it('returns count as string when count equals maxCount', () => {
		expect(getDisplayCount(99, 99)).toBe('99');
		expect(getDisplayCount(10, 10)).toBe('10');
		expect(getDisplayCount(1, 1)).toBe('1');
	});

	it('returns maxCount with "+" suffix when count exceeds maxCount', () => {
		expect(getDisplayCount(100, 99)).toBe('99+');
		expect(getDisplayCount(150, 99)).toBe('99+');
		expect(getDisplayCount(1000, 99)).toBe('99+');
		expect(getDisplayCount(11, 10)).toBe('10+');
		expect(getDisplayCount(2, 1)).toBe('1+');
	});

	it('handles zero count', () => {
		expect(getDisplayCount(0, 99)).toBe('0');
		expect(getDisplayCount(0, 10)).toBe('0');
		expect(getDisplayCount(0, 1)).toBe('0');
	});

	it('handles different maxCount values', () => {
		expect(getDisplayCount(5, 1)).toBe('1+');
		expect(getDisplayCount(5, 5)).toBe('5');
		expect(getDisplayCount(5, 10)).toBe('5');
		expect(getDisplayCount(15, 10)).toBe('10+');
		expect(getDisplayCount(100, 50)).toBe('50+');
	});

	it('handles large numbers', () => {
		expect(getDisplayCount(1000, 99)).toBe('99+');
		expect(getDisplayCount(9999, 99)).toBe('99+');
		expect(getDisplayCount(1000000, 99)).toBe('99+');
	});

	it('returns string type for all inputs', () => {
		expect(typeof getDisplayCount(0, 99)).toBe('string');
		expect(typeof getDisplayCount(50, 99)).toBe('string');
		expect(typeof getDisplayCount(100, 99)).toBe('string');
	});
});

describe('NotificationBellHelpers - getButtonClasses', () => {
	const BASE_CLASSES = [
		'relative',
		'inline-flex',
		'items-center',
		'justify-center',
		'rounded-md',
		'transition-colors',
		'focus:outline-none',
		'focus:ring-2',
		'focus:ring-primary',
		'focus:ring-offset-2',
		'hover:bg-muted',
		'dark:hover:bg-muted',
		'disabled:opacity-disabled',
		'disabled:cursor-not-allowed',
	];

	it('returns base classes when animated is false and showBadge is false', () => {
		const result = getButtonClasses(false, false);
		expect(result).toContain('relative');
		expect(result).toContain('inline-flex');
		expect(result).not.toContain('animate-pulse');
	});

	it('returns base classes when animated is true but showBadge is false', () => {
		const result = getButtonClasses(true, false);
		expect(result).toContain('relative');
		expect(result).toContain('inline-flex');
		expect(result).not.toContain('animate-pulse');
	});

	it('returns base classes when animated is false but showBadge is true', () => {
		const result = getButtonClasses(false, true);
		expect(result).toContain('relative');
		expect(result).toContain('inline-flex');
		expect(result).not.toContain('animate-pulse');
	});

	it('includes animate-pulse when both animated and showBadge are true', () => {
		const result = getButtonClasses(true, true);
		expect(result).toContain('animate-pulse');
		expect(result).toContain('relative');
		expect(result).toContain('inline-flex');
	});

	it('merges custom className when provided', () => {
		const customClass = 'custom-button-class';
		const result = getButtonClasses(false, false, customClass);
		expect(result).toContain(customClass);
		expect(result).toContain('relative');
	});

	it('merges custom className with animation when both animated and showBadge are true', () => {
		const customClass = 'custom-button-class';
		const result = getButtonClasses(true, true, customClass);
		expect(result).toContain(customClass);
		expect(result).toContain('animate-pulse');
		expect(result).toContain('relative');
	});

	it('handles multiple custom classes', () => {
		const customClasses = 'class1 class2 class3';
		const result = getButtonClasses(false, false, customClasses);
		expect(result).toContain('class1');
		expect(result).toContain('class2');
		expect(result).toContain('class3');
	});

	it('handles empty string className', () => {
		const result = getButtonClasses(false, false, '');
		expect(result).toContain('relative');
		expect(result).toContain('inline-flex');
	});

	it('returns string type for all combinations', () => {
		expect(typeof getButtonClasses(false, false)).toBe('string');
		expect(typeof getButtonClasses(true, false)).toBe('string');
		expect(typeof getButtonClasses(false, true)).toBe('string');
		expect(typeof getButtonClasses(true, true)).toBe('string');
		expect(typeof getButtonClasses(false, false, 'custom')).toBe('string');
		expect(typeof getButtonClasses(true, true, 'custom')).toBe('string');
	});

	it('includes all base classes in result', () => {
		const result = getButtonClasses(false, false);
		for (const baseClass of BASE_CLASSES) {
			expect(result).toContain(baseClass);
		}
	});

	it('handles undefined className', () => {
		const result = getButtonClasses(false, false, undefined);
		expect(result).toContain('relative');
		expect(result).toContain('inline-flex');
		expect(result).not.toContain('undefined');
	});
});
