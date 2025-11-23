/**
 * filterBuilderHelpers Tests
 *
 * Tests for helper functions:
 * - createFilterPropsByType
 * - createNewFilter
 * - getDefaultFilterType
 */

import {
	createFilterPropsByType,
	createNewFilter,
	getDefaultFilterType,
} from '@core/ui/data-display/data-table/helpers/filterBuilderHelpers';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';
import { describe, expect, it } from 'vitest';

describe('createFilterPropsByType', () => {
	it('should return options array for select type', () => {
		const props = createFilterPropsByType('select');
		expect(props).toEqual({ options: [] });
	});

	it('should return options array for multi-select type', () => {
		const props = createFilterPropsByType('multi-select');
		expect(props).toEqual({ options: [] });
	});

	it('should return value empty string for text type', () => {
		const props = createFilterPropsByType('text');
		expect(props).toEqual({ value: '' });
	});

	it('should return value empty string for date type', () => {
		const props = createFilterPropsByType('date');
		expect(props).toEqual({ value: '' });
	});

	it('should return startValue and endValue empty strings for date-range type', () => {
		const props = createFilterPropsByType('date-range');
		expect(props).toEqual({ startValue: '', endValue: '' });
	});
});

describe('createNewFilter', () => {
	it('should create a text filter with required properties', () => {
		const filter = createNewFilter('Test Filter', 'text');

		expect(filter.id).toBeTruthy();
		expect(filter.id).toContain('filter-');
		expect(filter.label).toBe('Test Filter');
		expect(filter.type).toBe('text');
		if (filter.type === 'text') {
			expect(filter.value).toBe('');
		}
	});

	it('should create a select filter with required properties', () => {
		const filter = createNewFilter('Status Filter', 'select');

		expect(filter.id).toBeTruthy();
		expect(filter.label).toBe('Status Filter');
		expect(filter.type).toBe('select');
		expect((filter as AdvancedFilter & { options: unknown[] }).options).toEqual([]);
	});

	it('should create a multi-select filter with required properties', () => {
		const filter = createNewFilter('Tags Filter', 'multi-select');

		expect(filter.id).toBeTruthy();
		expect(filter.label).toBe('Tags Filter');
		expect(filter.type).toBe('multi-select');
		expect((filter as AdvancedFilter & { options: unknown[] }).options).toEqual([]);
	});

	it('should create a date filter with required properties', () => {
		const filter = createNewFilter('Date Filter', 'date');

		expect(filter.id).toBeTruthy();
		expect(filter.label).toBe('Date Filter');
		expect(filter.type).toBe('date');
		expect((filter as AdvancedFilter & { value: string }).value).toBe('');
	});

	it('should create a date-range filter with required properties', () => {
		const filter = createNewFilter('Date Range Filter', 'date-range');

		expect(filter.id).toBeTruthy();
		expect(filter.label).toBe('Date Range Filter');
		expect(filter.type).toBe('date-range');
		expect((filter as AdvancedFilter & { startValue: string; endValue: string }).startValue).toBe(
			''
		);
		expect((filter as AdvancedFilter & { startValue: string; endValue: string }).endValue).toBe('');
	});

	it('should trim label whitespace', () => {
		const filter = createNewFilter('  Trimmed Filter  ', 'text');

		expect(filter.label).toBe('Trimmed Filter');
	});

	it('should throw error for empty label', () => {
		expect(() => createNewFilter('', 'text')).toThrow('Filter label cannot be empty');
		expect(() => createNewFilter('   ', 'text')).toThrow('Filter label cannot be empty');
	});

	it('should generate unique IDs for multiple filters', () => {
		const filter1 = createNewFilter('Filter 1', 'text');
		const filter2 = createNewFilter('Filter 2', 'text');

		expect(filter1.id).not.toBe(filter2.id);
	});

	it('should generate IDs with timestamp and random suffix', () => {
		const filter = createNewFilter('Test', 'text');

		expect(filter.id).toMatch(/^filter-\d+-[\da-z]+$/);
		const parts = filter.id.split('-');
		expect(parts.length).toBeGreaterThanOrEqual(3);
		expect(parts[0]).toBe('filter');
		const part1 = parts[1];
		if (part1) {
			expect(Number.parseInt(part1, 10)).toBeGreaterThan(0);
		}
	});

	it('should handle labels with special characters', () => {
		const filter = createNewFilter('Filter & Test (Special)', 'text');

		expect(filter.label).toBe('Filter & Test (Special)');
		expect(filter.type).toBe('text');
	});

	it('should handle very long labels', () => {
		const longLabel = 'A'.repeat(1000);
		const filter = createNewFilter(longLabel, 'text');

		expect(filter.label).toBe(longLabel);
		expect(filter.label.length).toBe(1000);
	});
});

describe('getDefaultFilterType', () => {
	it('should return text as default filter type', () => {
		const defaultType = getDefaultFilterType();
		expect(defaultType).toBe('text');
	});

	it('should return a valid AdvancedFilter type', () => {
		const defaultType = getDefaultFilterType();
		const validTypes: AdvancedFilter['type'][] = [
			'text',
			'select',
			'multi-select',
			'date',
			'date-range',
		];
		expect(validTypes).toContain(defaultType);
	});
});
