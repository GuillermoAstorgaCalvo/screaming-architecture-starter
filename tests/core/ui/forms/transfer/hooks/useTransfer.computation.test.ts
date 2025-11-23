/**
 * useTransfer.computation Tests
 *
 * Tests for computation hooks:
 * - useComputedDisabledStates
 * - useFilteredOptions
 * - useTransferComputation
 */

import {
	useComputedDisabledStates,
	useFilteredOptions,
	useTransferComputation,
} from '@core/ui/forms/transfer/hooks/useTransfer.computation';
import { useTransferState } from '@core/ui/forms/transfer/hooks/useTransfer.state';
import type { TransferOption } from '@src-types/ui/data/transfer';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const createMockOption = (value: string, label?: string, disabled = false) => ({
	value,
	label: label ?? `Label ${value}`,
	disabled,
});

describe('useComputedDisabledStates', () => {
	it('should be a function', () => {
		expect(typeof useComputedDisabledStates).toBe('function');
	});

	it('returns disabled states', () => {
		const { result } = renderHook(() =>
			useComputedDisabledStates({
				disabled: false,
				selectedSourceValues: new Set(),
				selectedTargetValues: new Set(),
				filteredSourceOptions: [],
				filteredTargetOptions: [],
			})
		);

		expect(typeof result.current.isMoveToTargetDisabled).toBe('boolean');
		expect(typeof result.current.isMoveToSourceDisabled).toBe('boolean');
	});

	it('disables move to target when disabled prop is true', () => {
		const { result } = renderHook(() =>
			useComputedDisabledStates({
				disabled: true,
				selectedSourceValues: new Set(['value1']),
				selectedTargetValues: new Set(),
				filteredSourceOptions: [createMockOption('value1')],
				filteredTargetOptions: [],
			})
		);

		expect(result.current.isMoveToTargetDisabled).toBe(true);
	});

	it('disables move to target when no source items selected', () => {
		const { result } = renderHook(() =>
			useComputedDisabledStates({
				disabled: false,
				selectedSourceValues: new Set(),
				selectedTargetValues: new Set(),
				filteredSourceOptions: [createMockOption('value1')],
				filteredTargetOptions: [],
			})
		);

		expect(result.current.isMoveToTargetDisabled).toBe(true);
	});

	it('disables move to target when no filtered source options', () => {
		const { result } = renderHook(() =>
			useComputedDisabledStates({
				disabled: false,
				selectedSourceValues: new Set(['value1']),
				selectedTargetValues: new Set(),
				filteredSourceOptions: [],
				filteredTargetOptions: [],
			})
		);

		expect(result.current.isMoveToTargetDisabled).toBe(true);
	});

	it('enables move to target when conditions are met', () => {
		const { result } = renderHook(() =>
			useComputedDisabledStates({
				disabled: false,
				selectedSourceValues: new Set(['value1']),
				selectedTargetValues: new Set(),
				filteredSourceOptions: [createMockOption('value1')],
				filteredTargetOptions: [],
			})
		);

		expect(result.current.isMoveToTargetDisabled).toBe(false);
	});

	it('disables move to source when disabled prop is true', () => {
		const { result } = renderHook(() =>
			useComputedDisabledStates({
				disabled: true,
				selectedSourceValues: new Set(),
				selectedTargetValues: new Set(['value1']),
				filteredSourceOptions: [],
				filteredTargetOptions: [createMockOption('value1')],
			})
		);

		expect(result.current.isMoveToSourceDisabled).toBe(true);
	});

	it('disables move to source when no target items selected', () => {
		const { result } = renderHook(() =>
			useComputedDisabledStates({
				disabled: false,
				selectedSourceValues: new Set(),
				selectedTargetValues: new Set(),
				filteredSourceOptions: [],
				filteredTargetOptions: [createMockOption('value1')],
			})
		);

		expect(result.current.isMoveToSourceDisabled).toBe(true);
	});

	it('disables move to source when no filtered target options', () => {
		const { result } = renderHook(() =>
			useComputedDisabledStates({
				disabled: false,
				selectedSourceValues: new Set(),
				selectedTargetValues: new Set(['value1']),
				filteredSourceOptions: [],
				filteredTargetOptions: [],
			})
		);

		expect(result.current.isMoveToSourceDisabled).toBe(true);
	});

	it('enables move to source when conditions are met', () => {
		const { result } = renderHook(() =>
			useComputedDisabledStates({
				disabled: false,
				selectedSourceValues: new Set(),
				selectedTargetValues: new Set(['value1']),
				filteredSourceOptions: [],
				filteredTargetOptions: [createMockOption('value1')],
			})
		);

		expect(result.current.isMoveToSourceDisabled).toBe(false);
	});
});

describe('useFilteredOptions', () => {
	it('should be a function', () => {
		expect(typeof useFilteredOptions).toBe('function');
	});

	it('returns filtered options', () => {
		const { result } = renderHook(() =>
			useFilteredOptions({
				sourceOptions: [],
				targetOptions: [],
				sourceSearchValue: '',
				targetSearchValue: '',
				showSearch: true,
			})
		);

		expect(Array.isArray(result.current.filteredSourceOptions)).toBe(true);
		expect(Array.isArray(result.current.filteredTargetOptions)).toBe(true);
	});

	it('returns all options when search is disabled', () => {
		const sourceOptions = [
			createMockOption('value1', 'Label One'),
			createMockOption('value2', 'Label Two'),
		];
		const targetOptions = [createMockOption('value3', 'Label Three')];

		const { result } = renderHook(() =>
			useFilteredOptions({
				sourceOptions,
				targetOptions,
				sourceSearchValue: 'test',
				targetSearchValue: 'test',
				showSearch: false,
			})
		);

		expect(result.current.filteredSourceOptions).toEqual(sourceOptions);
		expect(result.current.filteredTargetOptions).toEqual(targetOptions);
	});

	it('returns all options when search value is empty', () => {
		const sourceOptions = [
			createMockOption('value1', 'Label One'),
			createMockOption('value2', 'Label Two'),
		];
		const targetOptions = [createMockOption('value3', 'Label Three')];

		const { result } = renderHook(() =>
			useFilteredOptions({
				sourceOptions,
				targetOptions,
				sourceSearchValue: '',
				targetSearchValue: '',
				showSearch: true,
			})
		);

		expect(result.current.filteredSourceOptions).toEqual(sourceOptions);
		expect(result.current.filteredTargetOptions).toEqual(targetOptions);
	});

	it('filters source options by label', () => {
		const sourceOptions = [
			createMockOption('value1', 'Apple'),
			createMockOption('value2', 'Banana'),
			createMockOption('value3', 'Cherry'),
		];
		const targetOptions: TransferOption[] = [];

		const { result } = renderHook(() =>
			useFilteredOptions({
				sourceOptions,
				targetOptions,
				sourceSearchValue: 'an',
				targetSearchValue: '',
				showSearch: true,
			})
		);

		expect(result.current.filteredSourceOptions).toHaveLength(1);
		expect(result.current.filteredSourceOptions[0]?.value).toBe('value2');
	});

	it('filters target options by label', () => {
		const sourceOptions: TransferOption[] = [];
		const targetOptions = [
			createMockOption('value1', 'Apple'),
			createMockOption('value2', 'Banana'),
			createMockOption('value3', 'Cherry'),
		];

		const { result } = renderHook(() =>
			useFilteredOptions({
				sourceOptions,
				targetOptions,
				sourceSearchValue: '',
				targetSearchValue: 'an',
				showSearch: true,
			})
		);

		expect(result.current.filteredTargetOptions).toHaveLength(1);
		expect(result.current.filteredTargetOptions[0]?.value).toBe('value2');
	});

	it('uses custom filter function when provided', () => {
		const sourceOptions = [
			createMockOption('value1', 'Apple'),
			createMockOption('value2', 'Banana'),
		];
		const targetOptions: TransferOption[] = [];
		const customFilterFn = vi.fn((option, searchValue) => option.value.includes(searchValue));

		const { result } = renderHook(() =>
			useFilteredOptions({
				sourceOptions,
				targetOptions,
				sourceSearchValue: 'value1',
				targetSearchValue: '',
				showSearch: true,
				filterFn: customFilterFn,
			})
		);

		expect(result.current.filteredSourceOptions).toHaveLength(1);
		expect(result.current.filteredSourceOptions[0]?.value).toBe('value1');
		expect(customFilterFn).toHaveBeenCalled();
	});

	it('filters case-insensitively', () => {
		const sourceOptions = [
			createMockOption('value1', 'Apple'),
			createMockOption('value2', 'Banana'),
		];
		const targetOptions: TransferOption[] = [];

		const { result } = renderHook(() =>
			useFilteredOptions({
				sourceOptions,
				targetOptions,
				sourceSearchValue: 'APPLE',
				targetSearchValue: '',
				showSearch: true,
			})
		);

		expect(result.current.filteredSourceOptions).toHaveLength(1);
		expect(result.current.filteredSourceOptions[0]?.value).toBe('value1');
	});
});

describe('useTransferComputation', () => {
	it('should be a function', () => {
		expect(typeof useTransferComputation).toBe('function');
	});

	it('returns all computed values and handlers', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const state = stateResult.current;
		const setValue = vi.fn();
		const options = [
			createMockOption('value1'),
			createMockOption('value2'),
			createMockOption('value3'),
		];

		const { result } = renderHook(() =>
			useTransferComputation({
				options,
				currentValue: ['value1'],
				state,
				setValue,
				showSearch: true,
				filterFn: undefined,
				disabled: false,
			})
		);

		expect(Array.isArray(result.current.filteredSourceOptions)).toBe(true);
		expect(Array.isArray(result.current.filteredTargetOptions)).toBe(true);
		expect(typeof result.current.handlers.handleSourceSearchChange).toBe('function');
		expect(typeof result.current.handlers.handleMoveToTarget).toBe('function');
		expect(typeof result.current.isMoveToTargetDisabled).toBe('boolean');
		expect(typeof result.current.isMoveToSourceDisabled).toBe('boolean');
	});

	it('computes source and target options correctly', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const state = stateResult.current;
		const setValue = vi.fn();
		const options = [
			createMockOption('value1'),
			createMockOption('value2'),
			createMockOption('value3'),
		];

		const { result } = renderHook(() =>
			useTransferComputation({
				options,
				currentValue: ['value1', 'value2'],
				state,
				setValue,
				showSearch: false,
				filterFn: undefined,
				disabled: false,
			})
		);

		expect(result.current.filteredSourceOptions).toHaveLength(1);
		expect(result.current.filteredSourceOptions[0]?.value).toBe('value3');
		expect(result.current.filteredTargetOptions).toHaveLength(2);
		expect(result.current.filteredTargetOptions[0]?.value).toBe('value1');
		expect(result.current.filteredTargetOptions[1]?.value).toBe('value2');
	});

	it('applies search filtering', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const setValue = vi.fn();
		const options = [
			createMockOption('value1', 'Label One'),
			createMockOption('value2', 'Label Two'),
		];

		act(() => {
			stateResult.current.setSourceSearchValue('One');
		});

		const { result } = renderHook(() =>
			useTransferComputation({
				options,
				currentValue: [],
				state: stateResult.current,
				setValue,
				showSearch: true,
				filterFn: undefined,
				disabled: false,
			})
		);

		expect(result.current.filteredSourceOptions).toHaveLength(1);
		expect(result.current.filteredSourceOptions[0]?.value).toBe('value1');
	});

	it('uses custom filter function', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const setValue = vi.fn();
		const options = [createMockOption('value1'), createMockOption('value2')];
		const customFilterFn = vi.fn(option => option.value === 'value1');

		act(() => {
			stateResult.current.setSourceSearchValue('custom');
		});

		const { result } = renderHook(() =>
			useTransferComputation({
				options,
				currentValue: [],
				state: stateResult.current,
				setValue,
				showSearch: true,
				filterFn: customFilterFn,
				disabled: false,
			})
		);

		expect(result.current.filteredSourceOptions).toHaveLength(1);
		expect(customFilterFn).toHaveBeenCalled();
	});

	it('computes disabled states correctly', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const setValue = vi.fn();
		const options = [createMockOption('value1'), createMockOption('value2')];

		act(() => {
			stateResult.current.setSelectedSourceValues(new Set(['value1']));
		});

		const { result } = renderHook(() =>
			useTransferComputation({
				options,
				currentValue: [],
				state: stateResult.current,
				setValue,
				showSearch: false,
				filterFn: undefined,
				disabled: false,
			})
		);

		expect(result.current.isMoveToTargetDisabled).toBe(false);
		expect(result.current.isMoveToSourceDisabled).toBe(true);
	});
});
