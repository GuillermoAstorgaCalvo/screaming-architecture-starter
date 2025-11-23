/**
 * useTransfer.utils Tests
 *
 * Tests for useTransfer utility functions including:
 * - Source and target options computation
 * - Options filtering
 */

import {
	computeSourceAndTargetOptions,
	filterOptions,
} from '@core/ui/forms/transfer/helpers/useTransfer.utils';
import type { TransferOption } from '@src-types/ui/data/transfer';
import React from 'react';
import { describe, expect, it } from 'vitest';

describe('computeSourceAndTargetOptions', () => {
	it('separates options into source and target based on value', () => {
		const options: TransferOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
			{ value: '3', label: 'Option 3' },
		];
		const currentValue = ['1', '3'];

		const result = computeSourceAndTargetOptions(options, currentValue);

		expect(result.sourceOptions).toHaveLength(1);
		expect(result.sourceOptions[0]?.value).toBe('2');
		expect(result.targetOptions).toHaveLength(2);
		expect(result.targetOptions.map(o => o.value)).toEqual(['1', '3']);
	});

	it('returns all options in source when value is empty', () => {
		const options: TransferOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
		];
		const currentValue: string[] = [];

		const result = computeSourceAndTargetOptions(options, currentValue);

		expect(result.sourceOptions).toHaveLength(2);
		expect(result.targetOptions).toHaveLength(0);
	});

	it('returns all options in target when all values are selected', () => {
		const options: TransferOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
		];
		const currentValue = ['1', '2'];

		const result = computeSourceAndTargetOptions(options, currentValue);

		expect(result.sourceOptions).toHaveLength(0);
		expect(result.targetOptions).toHaveLength(2);
	});

	it('preserves option data', () => {
		const options: TransferOption<{ id: number }>[] = [
			{ value: '1', label: 'Option 1', data: { id: 1 } },
			{ value: '2', label: 'Option 2', data: { id: 2 } },
		];
		const currentValue = ['1'];

		const result = computeSourceAndTargetOptions(options, currentValue);

		expect(result.targetOptions[0]?.data).toEqual({ id: 1 });
		expect(result.sourceOptions[0]?.data).toEqual({ id: 2 });
	});

	it('handles duplicate values in currentValue', () => {
		const options: TransferOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
		];
		const currentValue = ['1', '1', '2'];

		const result = computeSourceAndTargetOptions(options, currentValue);

		expect(result.targetOptions).toHaveLength(2);
		expect(result.sourceOptions).toHaveLength(0);
	});

	it('handles values not in options', () => {
		const options: TransferOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
		];
		const currentValue = ['3', '4'];

		const result = computeSourceAndTargetOptions(options, currentValue);

		expect(result.sourceOptions).toHaveLength(2);
		expect(result.targetOptions).toHaveLength(0);
	});
});

describe('filterOptions', () => {
	const createOptions = (): TransferOption[] => [
		{ value: '1', label: 'Apple' },
		{ value: '2', label: 'Banana' },
		{ value: '3', label: 'Cherry' },
	];

	it('returns all options when showSearch is false', () => {
		const options = createOptions();
		const result = filterOptions({
			options,
			searchValue: 'app',
			showSearch: false,
		});
		expect(result).toBe(options);
	});

	it('returns all options when searchValue is empty', () => {
		const options = createOptions();
		const result = filterOptions({
			options,
			searchValue: '',
			showSearch: true,
		});
		expect(result).toBe(options);
	});

	it('returns all options when searchValue is only whitespace', () => {
		const options = createOptions();
		const result = filterOptions({
			options,
			searchValue: '   ',
			showSearch: true,
		});
		expect(result).toBe(options);
	});

	it('filters options by label (case insensitive)', () => {
		const options = createOptions();
		const result = filterOptions({
			options,
			searchValue: 'app',
			showSearch: true,
		});
		expect(result).toHaveLength(1);
		expect(result[0]?.value).toBe('1');
	});

	it('filters options with uppercase search', () => {
		const options = createOptions();
		const result = filterOptions({
			options,
			searchValue: 'BANANA',
			showSearch: true,
		});
		expect(result).toHaveLength(1);
		expect(result[0]?.value).toBe('2');
	});

	it('filters multiple matching options', () => {
		const options: TransferOption[] = [
			{ value: '1', label: 'Apple' },
			{ value: '2', label: 'Application' },
			{ value: '3', label: 'Banana' },
		];
		const result = filterOptions({
			options,
			searchValue: 'app',
			showSearch: true,
		});
		expect(result).toHaveLength(2);
		expect(result.map(o => o.value)).toEqual(['1', '2']);
	});

	it('uses custom filterFn when provided', () => {
		const options = createOptions();
		const customFilter = (option: TransferOption, search: string) => option.value === search;
		const result = filterOptions({
			options,
			searchValue: '2',
			showSearch: true,
			filterFn: customFilter,
		});
		expect(result).toHaveLength(1);
		expect(result[0]?.value).toBe('2');
	});

	it('handles number labels', () => {
		const options: TransferOption[] = [
			{ value: '1', label: 123 },
			{ value: '2', label: 456 },
		];
		const result = filterOptions({
			options,
			searchValue: '12',
			showSearch: true,
		});
		expect(result).toHaveLength(1);
		expect(result[0]?.value).toBe('1');
	});

	it('excludes ReactNode labels that are not string or number', () => {
		const options: TransferOption[] = [
			{ value: '1', label: React.createElement('span', null, 'React Element') },
			{ value: '2', label: 'String Label' },
		];
		const result = filterOptions({
			options,
			searchValue: 'String',
			showSearch: true,
		});
		expect(result).toHaveLength(1);
		expect(result[0]?.value).toBe('2');
	});

	it('returns empty array when no matches found', () => {
		const options = createOptions();
		const result = filterOptions({
			options,
			searchValue: 'xyz',
			showSearch: true,
		});
		expect(result).toHaveLength(0);
	});
});
