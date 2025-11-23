/**
 * useTransfer.handlers Tests
 *
 * Tests for the main handlers hook:
 * - useTransferHandlers
 */

import { useTransferHandlers } from '@core/ui/forms/transfer/hooks/useTransfer.handlers';
import { useTransferState } from '@core/ui/forms/transfer/hooks/useTransfer.state';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const createMockOption = (value: string, disabled = false) => ({
	value,
	label: `Label ${value}`,
	disabled,
});

describe('useTransferHandlers', () => {
	it('should be a function', () => {
		expect(typeof useTransferHandlers).toBe('function');
	});

	it('returns all handler functions', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const state = stateResult.current;
		const setValue = vi.fn();

		const { result } = renderHook(() =>
			useTransferHandlers({
				disabled: false,
				currentValue: [],
				state,
				setValue,
				filteredSourceOptions: [],
				filteredTargetOptions: [],
			})
		);

		expect(typeof result.current.handleSourceSearchChange).toBe('function');
		expect(typeof result.current.handleTargetSearchChange).toBe('function');
		expect(typeof result.current.handleSourceItemToggle).toBe('function');
		expect(typeof result.current.handleTargetItemToggle).toBe('function');
		expect(typeof result.current.handleSourceSelectAll).toBe('function');
		expect(typeof result.current.handleSourceSelectNone).toBe('function');
		expect(typeof result.current.handleTargetSelectAll).toBe('function');
		expect(typeof result.current.handleTargetSelectNone).toBe('function');
		expect(typeof result.current.handleMoveToTarget).toBe('function');
		expect(typeof result.current.handleMoveToSource).toBe('function');
	});

	it('integrates search handlers', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const state = stateResult.current;
		const setValue = vi.fn();

		const { result } = renderHook(() =>
			useTransferHandlers({
				disabled: false,
				currentValue: [],
				state,
				setValue,
				filteredSourceOptions: [],
				filteredTargetOptions: [],
			})
		);

		act(() => {
			result.current.handleSourceSearchChange('test');
		});
		expect(stateResult.current.sourceSearchValue).toBe('test');

		act(() => {
			result.current.handleTargetSearchChange('target');
		});
		expect(stateResult.current.targetSearchValue).toBe('target');
	});

	it('integrates selection handlers', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const state = stateResult.current;
		const setValue = vi.fn();

		const { result } = renderHook(() =>
			useTransferHandlers({
				disabled: false,
				currentValue: [],
				state,
				setValue,
				filteredSourceOptions: [],
				filteredTargetOptions: [],
			})
		);

		act(() => {
			result.current.handleSourceItemToggle('value1');
		});
		expect(stateResult.current.selectedSourceValues.has('value1')).toBe(true);

		act(() => {
			result.current.handleTargetItemToggle('value2');
		});
		expect(stateResult.current.selectedTargetValues.has('value2')).toBe(true);
	});

	it('integrates select all handlers', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const state = stateResult.current;
		const setValue = vi.fn();
		const sourceOptions = [createMockOption('value1'), createMockOption('value2')];
		const targetOptions = [createMockOption('value3'), createMockOption('value4')];

		const { result } = renderHook(() =>
			useTransferHandlers({
				disabled: false,
				currentValue: [],
				state,
				setValue,
				filteredSourceOptions: sourceOptions,
				filteredTargetOptions: targetOptions,
			})
		);

		act(() => {
			result.current.handleSourceSelectAll();
		});
		expect(stateResult.current.selectedSourceValues.size).toBe(2);
		expect(stateResult.current.selectedSourceValues.has('value1')).toBe(true);
		expect(stateResult.current.selectedSourceValues.has('value2')).toBe(true);

		act(() => {
			result.current.handleTargetSelectAll();
		});
		expect(stateResult.current.selectedTargetValues.size).toBe(2);
		expect(stateResult.current.selectedTargetValues.has('value3')).toBe(true);
		expect(stateResult.current.selectedTargetValues.has('value4')).toBe(true);
	});

	it('integrates move handlers', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const state = stateResult.current;
		const setValue = vi.fn();

		// Set up initial selections
		act(() => {
			state.setSelectedSourceValues(new Set(['value1']));
			state.setSelectedTargetValues(new Set(['value2']));
		});

		const { result } = renderHook(() =>
			useTransferHandlers({
				disabled: false,
				currentValue: ['value2'],
				state: stateResult.current,
				setValue,
				filteredSourceOptions: [createMockOption('value1')],
				filteredTargetOptions: [createMockOption('value2')],
			})
		);

		act(() => {
			result.current.handleMoveToTarget();
		});
		expect(setValue).toHaveBeenCalledWith(['value2', 'value1']);

		// Reset for next test
		setValue.mockClear();
		act(() => {
			stateResult.current.setSelectedTargetValues(new Set(['value1']));
		});

		const { result: result2 } = renderHook(() =>
			useTransferHandlers({
				disabled: false,
				currentValue: ['value2', 'value1'],
				state: stateResult.current,
				setValue,
				filteredSourceOptions: [],
				filteredTargetOptions: [createMockOption('value1'), createMockOption('value2')],
			})
		);

		act(() => {
			result2.current.handleMoveToSource();
		});
		expect(setValue).toHaveBeenCalledWith(['value2']);
	});

	it('passes disabled state to handlers', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const state = stateResult.current;
		const setValue = vi.fn();

		const { result } = renderHook(() =>
			useTransferHandlers({
				disabled: true,
				currentValue: [],
				state,
				setValue,
				filteredSourceOptions: [createMockOption('value1')],
				filteredTargetOptions: [createMockOption('value2')],
			})
		);

		// These should not work when disabled
		act(() => {
			result.current.handleSourceSelectAll();
		});
		expect(stateResult.current.selectedSourceValues.size).toBe(0);

		act(() => {
			result.current.handleMoveToTarget();
		});
		expect(setValue).not.toHaveBeenCalled();
	});

	it('handles all handlers working together', () => {
		const { result: stateResult } = renderHook(() => useTransferState());
		const setValue = vi.fn();
		const sourceOptions = [createMockOption('value1'), createMockOption('value2')];
		const targetOptions = [createMockOption('value3')];

		const { result, rerender } = renderHook(
			({ state }) =>
				useTransferHandlers({
					disabled: false,
					currentValue: ['value3'],
					state,
					setValue,
					filteredSourceOptions: sourceOptions,
					filteredTargetOptions: targetOptions,
				}),
			{
				initialProps: { state: stateResult.current },
			}
		);

		// Search
		act(() => {
			result.current.handleSourceSearchChange('test');
		});
		rerender({ state: stateResult.current });
		expect(stateResult.current.sourceSearchValue).toBe('test');

		// Select all
		act(() => {
			result.current.handleSourceSelectAll();
		});
		rerender({ state: stateResult.current });
		expect(stateResult.current.selectedSourceValues.size).toBe(2);

		// Move to target
		act(() => {
			result.current.handleMoveToTarget();
		});
		expect(setValue).toHaveBeenCalledWith(['value3', 'value1', 'value2']);

		// Select none
		act(() => {
			result.current.handleSourceSelectNone();
		});
		rerender({ state: stateResult.current });
		expect(stateResult.current.selectedSourceValues.size).toBe(0);
	});
});
