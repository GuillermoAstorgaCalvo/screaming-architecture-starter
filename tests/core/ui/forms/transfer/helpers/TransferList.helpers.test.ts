/**
 * TransferList.helpers Tests
 *
 * Tests for TransferList helper functions including:
 * - All selected calculation
 * - Select all handler creation
 * - Props extraction with defaults
 */

import {
	calculateAllSelected,
	createSelectAllHandler,
	extractTransferListProps,
} from '@core/ui/forms/transfer/helpers/TransferList.helpers';
import type { TransferListProps } from '@core/ui/forms/transfer/types/TransferList.types';
import type { TransferOption } from '@src-types/ui/data/transfer';
import { describe, expect, it, vi } from 'vitest';

describe('calculateAllSelected', () => {
	it('returns true when all enabled options are selected', () => {
		const options: TransferOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
		];
		const selectedValues = new Set(['1', '2']);
		expect(calculateAllSelected(options, selectedValues)).toBe(true);
	});

	it('returns false when not all enabled options are selected', () => {
		const options: TransferOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
		];
		const selectedValues = new Set(['1']);
		expect(calculateAllSelected(options, selectedValues)).toBe(false);
	});

	it('returns false when no options are selected', () => {
		const options: TransferOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
		];
		const selectedValues = new Set<string>();
		expect(calculateAllSelected(options, selectedValues)).toBe(false);
	});

	it('returns false when options array is empty', () => {
		const options: TransferOption[] = [];
		const selectedValues = new Set(['1']);
		expect(calculateAllSelected(options, selectedValues)).toBe(false);
	});

	it('ignores disabled options', () => {
		// calculateAllSelected receives only enabled options (already filtered)
		const enabledOptions: TransferOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '3', label: 'Option 3' },
		];
		const selectedValues = new Set(['1', '3']);
		expect(calculateAllSelected(enabledOptions, selectedValues)).toBe(true);
	});

	it('returns false when disabled option is selected but enabled ones are not', () => {
		const options: TransferOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2', disabled: true },
		];
		const selectedValues = new Set(['2']);
		expect(calculateAllSelected(options, selectedValues)).toBe(false);
	});
});

describe('createSelectAllHandler', () => {
	it('calls onSelectNone when all are selected', () => {
		const onSelectAll = vi.fn();
		const onSelectNone = vi.fn();
		const handler = createSelectAllHandler(true, onSelectAll, onSelectNone);
		handler();
		expect(onSelectNone).toHaveBeenCalledTimes(1);
		expect(onSelectAll).not.toHaveBeenCalled();
	});

	it('calls onSelectAll when not all are selected', () => {
		const onSelectAll = vi.fn();
		const onSelectNone = vi.fn();
		const handler = createSelectAllHandler(false, onSelectAll, onSelectNone);
		handler();
		expect(onSelectAll).toHaveBeenCalledTimes(1);
		expect(onSelectNone).not.toHaveBeenCalled();
	});
});

describe('extractTransferListProps', () => {
	const createBaseProps = (): TransferListProps => ({
		type: 'source',
		options: [],
		selectedValues: new Set(),
		searchValue: '',
		onSearchChange: () => {},
		onItemToggle: () => {},
		onSelectAll: () => {},
		onSelectNone: () => {},
		title: 'Source',
	});

	it('applies default values', () => {
		const props = createBaseProps();
		const result = extractTransferListProps(props);
		expect(result.normalizedProps.searchPlaceholder).toBeDefined();
		expect(result.normalizedProps.showSearch).toBe(true);
		expect(result.normalizedProps.size).toBe('md');
		expect(result.normalizedProps.disabled).toBe(false);
		expect(result.normalizedProps.maxHeight).toBe(300);
		expect(result.normalizedProps.showSelectAll).toBe(true);
	});

	it('overrides defaults with provided props', () => {
		const props: TransferListProps = {
			...createBaseProps(),
			searchPlaceholder: 'Custom placeholder',
			showSearch: false,
			size: 'lg',
			disabled: true,
			maxHeight: 500,
			showSelectAll: false,
		};
		const result = extractTransferListProps(props);
		expect(result.normalizedProps.searchPlaceholder).toBe('Custom placeholder');
		expect(result.normalizedProps.showSearch).toBe(false);
		expect(result.normalizedProps.size).toBe('lg');
		expect(result.normalizedProps.disabled).toBe(true);
		expect(result.normalizedProps.maxHeight).toBe(500);
		expect(result.normalizedProps.showSelectAll).toBe(false);
	});

	it('preserves all required props in normalizedProps', () => {
		const options: TransferOption[] = [{ value: '1', label: 'Option 1' }];
		const selectedValues = new Set(['1']);
		const props: TransferListProps = {
			...createBaseProps(),
			options,
			selectedValues,
			searchValue: 'search',
			title: 'Custom Title',
			renderItem: () => null,
			renderEmpty: () => null,
			labels: { selectAll: 'Select All' },
		};
		const result = extractTransferListProps(props);
		expect(result.normalizedProps.type).toBe('source');
		expect(result.normalizedProps.options).toBe(options);
		expect(result.normalizedProps.selectedValues).toBe(selectedValues);
		expect(result.normalizedProps.searchValue).toBe('search');
		expect(result.normalizedProps.title).toBe('Custom Title');
		expect(result.normalizedProps.renderItem).toBeDefined();
		expect(result.normalizedProps.renderEmpty).toBeDefined();
		expect(result.normalizedProps.labels).toEqual({ selectAll: 'Select All' });
	});

	it('creates setup props correctly', () => {
		const options: TransferOption[] = [{ value: '1', label: 'Option 1' }];
		const selectedValues = new Set(['1']);
		const onSelectAll = vi.fn();
		const onSelectNone = vi.fn();
		const props: TransferListProps = {
			...createBaseProps(),
			type: 'target',
			options,
			selectedValues,
			size: 'lg',
			onSelectAll,
			onSelectNone,
		};
		const result = extractTransferListProps(props);
		expect(result.setupProps.type).toBe('target');
		expect(result.setupProps.options).toBe(options);
		expect(result.setupProps.selectedValues).toBe(selectedValues);
		expect(result.setupProps.size).toBe('lg');
		expect(result.setupProps.onSelectAll).toBe(onSelectAll);
		expect(result.setupProps.onSelectNone).toBe(onSelectNone);
	});

	it('handles nullish values with defaults', () => {
		const props = createBaseProps();
		const result = extractTransferListProps(props);
		expect(result.normalizedProps.searchPlaceholder).toBeDefined();
		expect(result.normalizedProps.showSearch).toBe(true);
		expect(result.normalizedProps.size).toBe('md');
		expect(result.normalizedProps.disabled).toBe(false);
		expect(result.normalizedProps.maxHeight).toBe(300);
		expect(result.normalizedProps.showSelectAll).toBe(true);
	});
});
