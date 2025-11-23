/**
 * useDataTableStateBuilders.sort Tests
 *
 * Tests for the buildSortStateOptions function:
 * - Optional initialSort is conditionally included
 * - Optional onSortChange callback is conditionally included
 * - Edge cases with null and undefined values
 */

import { buildSortStateOptions } from '@core/ui/data-display/data-table/state/useDataTableStateBuilders.sort';
import type { ColumnSort } from '@src-types/ui/dataTable';
import { describe, expect, it, vi } from 'vitest';

interface TestData {
	id: string;
	name: string;
	age: number;
}

describe('buildSortStateOptions', () => {
	it('should build empty options when no parameters provided', () => {
		const result = buildSortStateOptions<TestData>();

		expect(result).toEqual({});
		expect(result.initialSort).toBeUndefined();
		expect(result.onSortChange).toBeUndefined();
	});

	it('should build options with initialSort only', () => {
		const initialSort: ColumnSort<TestData> = {
			columnId: 'name',
			direction: 'asc',
		};

		const result = buildSortStateOptions(initialSort);

		expect(result).toEqual({
			initialSort,
		});
		expect(result.onSortChange).toBeUndefined();
	});

	it('should build options with onSortChange only', () => {
		const onSortChange = vi.fn();

		const result = buildSortStateOptions<TestData>(undefined, onSortChange);

		expect(result).toEqual({
			onSortChange,
		});
		expect(result.initialSort).toBeUndefined();
	});

	it('should build options with both initialSort and onSortChange', () => {
		const initialSort: ColumnSort<TestData> = {
			columnId: 'age',
			direction: 'desc',
		};
		const onSortChange = vi.fn();

		const result = buildSortStateOptions(initialSort, onSortChange);

		expect(result).toEqual({
			initialSort,
			onSortChange,
		});
	});

	it('should handle initialSort with asc direction', () => {
		const initialSort: ColumnSort<TestData> = {
			columnId: 'name',
			direction: 'asc',
		};

		const result = buildSortStateOptions(initialSort);

		expect(result.initialSort).toEqual(initialSort);
		expect(result.initialSort?.direction).toBe('asc');
	});

	it('should handle initialSort with desc direction', () => {
		const initialSort: ColumnSort<TestData> = {
			columnId: 'age',
			direction: 'desc',
		};

		const result = buildSortStateOptions(initialSort);

		expect(result.initialSort).toEqual(initialSort);
		expect(result.initialSort?.direction).toBe('desc');
	});

	it('should handle initialSort with custom sort function', () => {
		const customSortFn = (a: TestData, b: TestData) => a.age - b.age;
		const initialSort: ColumnSort<TestData> = {
			columnId: 'age',
			direction: 'asc',
			sortFn: customSortFn,
		};

		const result = buildSortStateOptions(initialSort);

		expect(result.initialSort).toEqual(initialSort);
		expect(result.initialSort?.sortFn).toBe(customSortFn);
	});

	it('should preserve sort object reference', () => {
		const initialSort: ColumnSort<TestData> = {
			columnId: 'name',
			direction: 'asc',
		};

		const result = buildSortStateOptions(initialSort);

		expect(result.initialSort).toBe(initialSort);
	});
});
