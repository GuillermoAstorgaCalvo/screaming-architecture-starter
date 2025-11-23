/**
 * TransferActions.utils Tests
 *
 * Tests for TransferActions utility functions including:
 * - Button size mapping
 * - Gap class generation
 * - Container class building
 */

import {
	getButtonSize,
	getContainerClasses,
	getGapClass,
} from '@core/ui/forms/transfer/helpers/TransferActions.utils';
import { describe, expect, it } from 'vitest';

describe('getButtonSize', () => {
	it('returns sm for sm size', () => {
		expect(getButtonSize('sm')).toBe('sm');
	});

	it('returns md for md size', () => {
		expect(getButtonSize('md')).toBe('md');
	});

	it('returns lg for lg size', () => {
		expect(getButtonSize('lg')).toBe('lg');
	});
});

describe('getGapClass', () => {
	it('returns gap-1 for sm size', () => {
		expect(getGapClass('sm')).toBe('gap-1');
	});

	it('returns empty string for md size', () => {
		expect(getGapClass('md')).toBe('');
	});

	it('returns gap-3 for lg size', () => {
		expect(getGapClass('lg')).toBe('gap-3');
	});
});

describe('getContainerClasses', () => {
	it('merges base classes with gap class', () => {
		const result = getContainerClasses('gap-1');
		expect(result).toContain('flex');
		expect(result).toContain('flex-col');
		expect(result).toContain('justify-center');
		expect(result).toContain('items-center');
		// twMerge will keep gap-1 and remove gap-2 since they conflict
		expect(result).toContain('gap-1');
		expect(result).not.toContain('gap-2');
	});

	it('handles empty gap class', () => {
		const result = getContainerClasses('');
		expect(result).toContain('flex');
		expect(result).toContain('gap-2');
	});

	it('handles custom gap classes', () => {
		const result = getContainerClasses('gap-4');
		expect(result).toContain('gap-4');
	});
});
