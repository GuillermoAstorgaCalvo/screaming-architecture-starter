/**
 * TransferList.styles Tests
 *
 * Tests for TransferList style utility functions including:
 * - Minimum width calculation
 * - Header padding
 * - Header text size
 * - List padding
 * - Container classes
 * - Header classes
 * - List container classes
 */

import {
	getContainerClasses,
	getHeaderClasses,
	getHeaderPadding,
	getHeaderTextSize,
	getListContainerClasses,
	getListPadding,
	getMinWidth,
} from '@core/ui/forms/transfer/helpers/TransferList.styles';
import { describe, expect, it } from 'vitest';

describe('getMinWidth', () => {
	it('returns sm width class for sm size', () => {
		const result = getMinWidth('sm');
		expect(result).toContain('min-w-[calc(var(--spacing-xs)*50)]');
	});

	it('returns md width class for md size', () => {
		const result = getMinWidth('md');
		expect(result).toContain('min-w-[calc(var(--spacing-xs)*62.5)]');
	});

	it('returns lg width class for lg size', () => {
		const result = getMinWidth('lg');
		expect(result).toContain('min-w-[calc(var(--spacing-xs)*75)]');
	});
});

describe('getHeaderPadding', () => {
	it('returns sm padding classes for sm size', () => {
		const result = getHeaderPadding('sm');
		expect(result).toContain('px-md');
		expect(result).toContain('py-[calc(var(--spacing-xs)+var(--spacing-xs)/2)]');
	});

	it('returns md padding classes for md size', () => {
		const result = getHeaderPadding('md');
		expect(result).toContain('px-lg');
		expect(result).toContain('py-sm');
	});

	it('returns lg padding classes for lg size', () => {
		const result = getHeaderPadding('lg');
		expect(result).toContain('px-[calc(var(--spacing-lg)+var(--spacing-xs))]');
		expect(result).toContain('py-md');
	});
});

describe('getHeaderTextSize', () => {
	it('returns text-sm for sm size', () => {
		expect(getHeaderTextSize('sm')).toBe('text-sm');
	});

	it('returns empty string for md size', () => {
		expect(getHeaderTextSize('md')).toBe('');
	});

	it('returns text-lg for lg size', () => {
		expect(getHeaderTextSize('lg')).toBe('text-lg');
	});
});

describe('getListPadding', () => {
	it('returns p-sm for sm size', () => {
		expect(getListPadding('sm')).toBe('p-sm');
	});

	it('returns p-md for md size', () => {
		expect(getListPadding('md')).toBe('p-md');
	});

	it('returns p-lg for lg size', () => {
		expect(getListPadding('lg')).toBe('p-lg');
	});
});

describe('getContainerClasses', () => {
	it('merges base classes with min width', () => {
		const minWidth = 'min-w-[200px]';
		const result = getContainerClasses(minWidth);
		expect(result).toContain('flex');
		expect(result).toContain('flex-col');
		expect(result).toContain('border');
		expect(result).toContain('border-border');
		expect(result).toContain('rounded-lg');
		expect(result).toContain('overflow-hidden');
		expect(result).toContain(minWidth);
	});
});

describe('getHeaderClasses', () => {
	it('merges base classes with padding and text size', () => {
		const headerPadding = 'px-md py-sm';
		const headerTextSize = 'text-sm';
		const result = getHeaderClasses(headerPadding, headerTextSize);
		expect(result).toContain('border-b');
		expect(result).toContain('border-border');
		expect(result).toContain('bg-muted');
		expect(result).toContain(headerPadding);
		expect(result).toContain(headerTextSize);
	});

	it('handles empty text size', () => {
		const headerPadding = 'px-md py-sm';
		const result = getHeaderClasses(headerPadding, '');
		expect(result).toContain(headerPadding);
	});
});

describe('getListContainerClasses', () => {
	it('merges base classes with padding', () => {
		const listPadding = 'p-md';
		const result = getListContainerClasses(listPadding);
		expect(result).toContain('overflow-y-auto');
		expect(result).toContain(listPadding);
	});
});
