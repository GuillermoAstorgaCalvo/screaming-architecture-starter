/**
 * InfiniteScrollHelpers Tests
 *
 * Tests for infinite-scroll helper functions:
 * - getInfiniteScrollClasses
 * - getSentinelClasses
 * - getLoadingContainerClasses
 * - getEndMessageClasses
 * - getErrorContainerClasses
 */

import {
	getEndMessageClasses,
	getErrorContainerClasses,
	getInfiniteScrollClasses,
	getLoadingContainerClasses,
	getSentinelClasses,
} from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollHelpers';
import { describe, expect, it } from 'vitest';

describe('InfiniteScrollHelpers - getInfiniteScrollClasses', () => {
	it('returns base classes when no className is provided', () => {
		const result = getInfiniteScrollClasses();

		expect(result).toBe('w-full');
	});

	it('merges base classes with provided className', () => {
		const result = getInfiniteScrollClasses('custom-class');

		expect(result).toContain('w-full');
		expect(result).toContain('custom-class');
	});

	it('handles undefined className', () => {
		const result = getInfiniteScrollClasses(undefined);

		expect(result).toBe('w-full');
	});

	it('handles empty string className', () => {
		const result = getInfiniteScrollClasses('');

		expect(result).toBe('w-full');
	});

	it('merges multiple classes correctly', () => {
		const result = getInfiniteScrollClasses('p-4 bg-blue-500');

		expect(result).toContain('w-full');
		expect(result).toContain('p-4');
		expect(result).toContain('bg-blue-500');
	});
});

describe('InfiniteScrollHelpers - getSentinelClasses', () => {
	it('returns correct sentinel classes', () => {
		const result = getSentinelClasses();

		expect(result).toBe('h-1 w-full');
	});

	it('always returns the same classes', () => {
		const result1 = getSentinelClasses();
		const result2 = getSentinelClasses();

		expect(result1).toBe(result2);
		expect(result1).toBe('h-1 w-full');
	});
});

describe('InfiniteScrollHelpers - getLoadingContainerClasses', () => {
	it('returns correct loading container classes', () => {
		const result = getLoadingContainerClasses();

		expect(result).toBe('flex items-center justify-center py-4');
	});

	it('always returns the same classes', () => {
		const result1 = getLoadingContainerClasses();
		const result2 = getLoadingContainerClasses();

		expect(result1).toBe(result2);
		expect(result1).toBe('flex items-center justify-center py-4');
	});
});

describe('InfiniteScrollHelpers - getEndMessageClasses', () => {
	it('returns correct end message classes', () => {
		const result = getEndMessageClasses();

		expect(result).toBe('flex items-center justify-center py-4 text-sm text-text-muted');
	});

	it('always returns the same classes', () => {
		const result1 = getEndMessageClasses();
		const result2 = getEndMessageClasses();

		expect(result1).toBe(result2);
		expect(result1).toBe('flex items-center justify-center py-4 text-sm text-text-muted');
	});
});

describe('InfiniteScrollHelpers - getErrorContainerClasses', () => {
	it('returns correct error container classes', () => {
		const result = getErrorContainerClasses();

		expect(result).toBe('flex flex-col items-center justify-center py-4 gap-2');
	});

	it('always returns the same classes', () => {
		const result1 = getErrorContainerClasses();
		const result2 = getErrorContainerClasses();

		expect(result1).toBe(result2);
		expect(result1).toBe('flex flex-col items-center justify-center py-4 gap-2');
	});
});
