/**
 * useTransfer Tests
 *
 * Tests for the main useTransfer hook:
 * - Initial state
 * - Controlled and uncontrolled modes
 * - Search functionality
 * - Selection and movement
 * - Integration with all handlers
 */

import { useTransfer } from '@core/ui/forms/transfer/hooks/useTransfer';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const createMockOption = (value: string, label?: string, disabled = false) => ({
	value,
	label: label ?? `Label ${value}`,
	disabled,
});

describe('useTransfer', () => {
	it('should be a function', () => {
		expect(typeof useTransfer).toBe('function');
	});

	it('returns all expected properties', () => {
		const options = [createMockOption('value1')];
		const { result } = renderHook(() =>
			useTransfer({
				options,
			})
		);

		expect(result.current).toHaveProperty('sourceOptions');
		expect(result.current).toHaveProperty('targetOptions');
		expect(result.current).toHaveProperty('selectedSourceValues');
		expect(result.current).toHaveProperty('selectedTargetValues');
		expect(result.current).toHaveProperty('sourceSearchValue');
		expect(result.current).toHaveProperty('targetSearchValue');
		expect(result.current).toHaveProperty('handleSourceSearchChange');
		expect(result.current).toHaveProperty('handleTargetSearchChange');
		expect(result.current).toHaveProperty('handleSourceItemToggle');
		expect(result.current).toHaveProperty('handleTargetItemToggle');
		expect(result.current).toHaveProperty('handleSourceSelectAll');
		expect(result.current).toHaveProperty('handleSourceSelectNone');
		expect(result.current).toHaveProperty('handleTargetSelectAll');
		expect(result.current).toHaveProperty('handleTargetSelectNone');
		expect(result.current).toHaveProperty('handleMoveToTarget');
		expect(result.current).toHaveProperty('handleMoveToSource');
		expect(result.current).toHaveProperty('isMoveToTargetDisabled');
		expect(result.current).toHaveProperty('isMoveToSourceDisabled');
		expect(result.current).toHaveProperty('props');
	});

	it('initializes with empty state', () => {
		const options = [createMockOption('value1'), createMockOption('value2')];
		const { result } = renderHook(() =>
			useTransfer({
				options,
			})
		);

		expect(result.current.sourceOptions).toHaveLength(2);
		expect(result.current.targetOptions).toHaveLength(0);
		expect(result.current.selectedSourceValues.size).toBe(0);
		expect(result.current.selectedTargetValues.size).toBe(0);
		expect(result.current.sourceSearchValue).toBe('');
		expect(result.current.targetSearchValue).toBe('');
	});

	it('works in controlled mode', () => {
		const options = [createMockOption('value1'), createMockOption('value2')];
		const controlledValue = ['value1'];
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useTransfer({
				options,
				value: controlledValue,
				onChange,
			})
		);

		expect(result.current.targetOptions).toHaveLength(1);
		expect(result.current.targetOptions[0]?.value).toBe('value1');
		expect(result.current.sourceOptions).toHaveLength(1);
		expect(result.current.sourceOptions[0]?.value).toBe('value2');
	});

	it('works in uncontrolled mode', () => {
		const options = [createMockOption('value1'), createMockOption('value2')];
		const defaultValue = ['value1'];
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useTransfer({
				options,
				defaultValue,
				onChange,
			})
		);

		expect(result.current.targetOptions).toHaveLength(1);
		expect(result.current.targetOptions[0]?.value).toBe('value1');
		expect(result.current.sourceOptions).toHaveLength(1);
		expect(result.current.sourceOptions[0]?.value).toBe('value2');
	});

	it('handles search functionality', () => {
		const options = [
			createMockOption('value1', 'Apple'),
			createMockOption('value2', 'Banana'),
			createMockOption('value3', 'Cherry'),
		];

		const { result } = renderHook(() =>
			useTransfer({
				options,
				showSearch: true,
			})
		);

		act(() => {
			result.current.handleSourceSearchChange('an');
		});

		expect(result.current.sourceSearchValue).toBe('an');
		expect(result.current.sourceOptions).toHaveLength(1);
		expect(result.current.sourceOptions[0]?.value).toBe('value2');
	});

	it('handles item selection', () => {
		const options = [createMockOption('value1'), createMockOption('value2')];

		const { result } = renderHook(() =>
			useTransfer({
				options,
			})
		);

		act(() => {
			result.current.handleSourceItemToggle('value1');
		});

		expect(result.current.selectedSourceValues.has('value1')).toBe(true);

		act(() => {
			result.current.handleSourceItemToggle('value1');
		});

		expect(result.current.selectedSourceValues.has('value1')).toBe(false);
	});

	it('handles select all/none', () => {
		const options = [
			createMockOption('value1'),
			createMockOption('value2'),
			createMockOption('value3', 'Label', true), // disabled
		];

		const { result } = renderHook(() =>
			useTransfer({
				options,
			})
		);

		act(() => {
			result.current.handleSourceSelectAll();
		});

		expect(result.current.selectedSourceValues.size).toBe(2);
		expect(result.current.selectedSourceValues.has('value1')).toBe(true);
		expect(result.current.selectedSourceValues.has('value2')).toBe(true);

		act(() => {
			result.current.handleSourceSelectNone();
		});

		expect(result.current.selectedSourceValues.size).toBe(0);
	});

	it('handles moving items from source to target', () => {
		const options = [createMockOption('value1'), createMockOption('value2')];
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useTransfer({
				options,
				onChange,
			})
		);

		act(() => {
			result.current.handleSourceItemToggle('value1');
		});

		act(() => {
			result.current.handleMoveToTarget();
		});

		expect(onChange).toHaveBeenCalledWith(['value1']);
		expect(result.current.selectedSourceValues.size).toBe(0);
		expect(result.current.sourceSearchValue).toBe('');
	});

	it('handles moving items from target to source', () => {
		const options = [createMockOption('value1'), createMockOption('value2')];
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useTransfer({
				options,
				defaultValue: ['value1', 'value2'],
				onChange,
			})
		);

		act(() => {
			result.current.handleTargetItemToggle('value1');
		});

		act(() => {
			result.current.handleMoveToSource();
		});

		expect(onChange).toHaveBeenCalledWith(['value2']);
		expect(result.current.selectedTargetValues.size).toBe(0);
		expect(result.current.targetSearchValue).toBe('');
	});

	it('respects disabled prop', () => {
		const options = [createMockOption('value1'), createMockOption('value2')];
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useTransfer({
				options,
				disabled: true,
				onChange,
			})
		);

		act(() => {
			result.current.handleSourceItemToggle('value1');
			result.current.handleSourceSelectAll();
			result.current.handleMoveToTarget();
		});

		expect(result.current.selectedSourceValues.size).toBe(0);
		expect(onChange).not.toHaveBeenCalled();
		expect(result.current.isMoveToTargetDisabled).toBe(true);
		expect(result.current.isMoveToSourceDisabled).toBe(true);
	});

	it('uses custom filter function', () => {
		const options = [createMockOption('value1', 'Apple'), createMockOption('value2', 'Banana')];
		const customFilterFn = vi.fn((option, searchValue) => option.value.includes(searchValue));

		const { result } = renderHook(() =>
			useTransfer({
				options,
				showSearch: true,
				filterFn: customFilterFn,
			})
		);

		act(() => {
			result.current.handleSourceSearchChange('value1');
		});

		expect(customFilterFn).toHaveBeenCalled();
		expect(result.current.sourceOptions).toHaveLength(1);
		expect(result.current.sourceOptions[0]?.value).toBe('value1');
	});

	it('handles search disabling selection', () => {
		const options = [createMockOption('value1'), createMockOption('value2')];

		const { result } = renderHook(() =>
			useTransfer({
				options,
				showSearch: true,
			})
		);

		act(() => {
			result.current.handleSourceItemToggle('value1');
		});

		expect(result.current.selectedSourceValues.has('value1')).toBe(true);

		act(() => {
			result.current.handleSourceSearchChange('test');
		});

		expect(result.current.selectedSourceValues.size).toBe(0);
	});

	it('computes disabled states correctly', () => {
		const options = [createMockOption('value1'), createMockOption('value2')];

		const { result } = renderHook(() =>
			useTransfer({
				options,
			})
		);

		expect(result.current.isMoveToTargetDisabled).toBe(true);
		expect(result.current.isMoveToSourceDisabled).toBe(true);

		act(() => {
			result.current.handleSourceItemToggle('value1');
		});

		expect(result.current.isMoveToTargetDisabled).toBe(false);
	});

	it('handles complex workflow', () => {
		const options = [
			createMockOption('value1', 'Apple'),
			createMockOption('value2', 'Banana'),
			createMockOption('value3', 'Cherry'),
		];
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useTransfer({
				options,
				showSearch: true,
				onChange,
			})
		);

		// Search
		act(() => {
			result.current.handleSourceSearchChange('an');
		});

		// Select all filtered
		act(() => {
			result.current.handleSourceSelectAll();
		});

		// Move to target
		act(() => {
			result.current.handleMoveToTarget();
		});

		expect(onChange).toHaveBeenCalled();
		expect(result.current.selectedSourceValues.size).toBe(0);
		expect(result.current.sourceSearchValue).toBe('');
	});
});
