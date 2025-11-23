/**
 * TransferList.setup Tests
 *
 * Tests for TransferList setup function including:
 * - ID generation
 * - Enabled options filtering
 * - All selected calculation
 * - Handler creation
 * - Class generation
 */

import { setupTransferList } from '@core/ui/forms/transfer/helpers/TransferList.setup';
import type { TransferListSetupOptions } from '@core/ui/forms/transfer/types/TransferList.types';
import type { TransferOption } from '@src-types/ui/data/transfer';
import { describe, expect, it, vi } from 'vitest';

describe('setupTransferList', () => {
	const createOptions = (): TransferOption[] => [
		{ value: '1', label: 'Option 1' },
		{ value: '2', label: 'Option 2' },
		{ value: '3', label: 'Option 3', disabled: true },
	];

	const createSetupOptions = (
		overrides?: Partial<TransferListSetupOptions<unknown>>
	): TransferListSetupOptions<unknown> => ({
		type: 'source',
		options: createOptions(),
		selectedValues: new Set(),
		size: 'md',
		onSelectAll: vi.fn(),
		onSelectNone: vi.fn(),
		...overrides,
	});

	it('generates correct search id for source type', () => {
		const options = createSetupOptions({ type: 'source' });
		const result = setupTransferList(options);
		expect(result.searchId).toBe('transfer-source-search');
	});

	it('generates correct search id for target type', () => {
		const options = createSetupOptions({ type: 'target' });
		const result = setupTransferList(options);
		expect(result.searchId).toBe('transfer-target-search');
	});

	it('generates correct header id for source type', () => {
		const options = createSetupOptions({ type: 'source' });
		const result = setupTransferList(options);
		expect(result.headerId).toBe('transfer-source-header');
	});

	it('generates correct header id for target type', () => {
		const options = createSetupOptions({ type: 'target' });
		const result = setupTransferList(options);
		expect(result.headerId).toBe('transfer-target-header');
	});

	it('filters out disabled options from enabledOptions', () => {
		const options = createSetupOptions();
		const result = setupTransferList(options);
		expect(result.enabledOptions).toHaveLength(2);
		expect(result.enabledOptions.map(o => o.value)).toEqual(['1', '2']);
	});

	it('calculates allSelected correctly when all enabled are selected', () => {
		const options = createSetupOptions({
			selectedValues: new Set(['1', '2']),
		});
		const result = setupTransferList(options);
		expect(result.allSelected).toBe(true);
	});

	it('calculates allSelected correctly when not all enabled are selected', () => {
		const options = createSetupOptions({
			selectedValues: new Set(['1']),
		});
		const result = setupTransferList(options);
		expect(result.allSelected).toBe(false);
	});

	it('calculates allSelected correctly when no options are selected', () => {
		const options = createSetupOptions({
			selectedValues: new Set(),
		});
		const result = setupTransferList(options);
		expect(result.allSelected).toBe(false);
	});

	it('ignores disabled options in allSelected calculation', () => {
		const options = createSetupOptions({
			selectedValues: new Set(['1', '2', '3']), // includes disabled option
		});
		const result = setupTransferList(options);
		expect(result.allSelected).toBe(true); // All enabled options are selected
	});

	it('creates handler that calls onSelectAll when not all selected', () => {
		const onSelectAll = vi.fn();
		const onSelectNone = vi.fn();
		const options = createSetupOptions({
			selectedValues: new Set(['1']),
			onSelectAll,
			onSelectNone,
		});
		const result = setupTransferList(options);
		result.handleSelectAllToggle();
		expect(onSelectAll).toHaveBeenCalledTimes(1);
		expect(onSelectNone).not.toHaveBeenCalled();
	});

	it('creates handler that calls onSelectNone when all selected', () => {
		const onSelectAll = vi.fn();
		const onSelectNone = vi.fn();
		const options = createSetupOptions({
			selectedValues: new Set(['1', '2']),
			onSelectAll,
			onSelectNone,
		});
		const result = setupTransferList(options);
		result.handleSelectAllToggle();
		expect(onSelectNone).toHaveBeenCalledTimes(1);
		expect(onSelectAll).not.toHaveBeenCalled();
	});

	it('generates container classes', () => {
		const options = createSetupOptions();
		const result = setupTransferList(options);
		expect(result.containerClasses).toBeDefined();
		expect(result.containerClasses).toContain('flex');
		expect(result.containerClasses).toContain('flex-col');
	});

	it('generates header classes', () => {
		const options = createSetupOptions();
		const result = setupTransferList(options);
		expect(result.headerClasses).toBeDefined();
		expect(result.headerClasses).toContain('border-b');
	});

	it('generates list container classes', () => {
		const options = createSetupOptions();
		const result = setupTransferList(options);
		expect(result.listContainerClasses).toBeDefined();
		expect(result.listContainerClasses).toContain('overflow-y-auto');
	});

	it('handles empty options array', () => {
		const options = createSetupOptions({ options: [] });
		const result = setupTransferList(options);
		expect(result.enabledOptions).toHaveLength(0);
		expect(result.allSelected).toBe(false);
	});
});
