/**
 * useTransfer.state Tests
 *
 * Tests for state management hooks:
 * - useControlledValue
 * - useTransferState
 */

import {
	useControlledValue,
	useTransferState,
} from '@core/ui/forms/transfer/hooks/useTransfer.state';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useControlledValue', () => {
	it('should be a function', () => {
		expect(typeof useControlledValue).toBe('function');
	});

	it('returns controlled value when provided', () => {
		const controlledValue = ['value1', 'value2'];
		const onChange = vi.fn();

		const { result } = renderHook(() => useControlledValue(controlledValue, undefined, onChange));

		expect(result.current.currentValue).toEqual(['value1', 'value2']);
		expect(result.current.currentValue).toBe(controlledValue);
	});

	it('returns uncontrolled value when controlled value is undefined', () => {
		const defaultValue = ['default1', 'default2'];
		const onChange = vi.fn();

		const { result } = renderHook(() => useControlledValue(undefined, defaultValue, onChange));

		expect(result.current.currentValue).toEqual(['default1', 'default2']);
	});

	it('returns empty array when both are undefined', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() => useControlledValue(undefined, undefined, onChange));

		expect(result.current.currentValue).toEqual([]);
	});

	it('calls onChange when setValue is called in controlled mode', () => {
		const controlledValue = ['value1'];
		const onChange = vi.fn();

		const { result } = renderHook(() => useControlledValue(controlledValue, undefined, onChange));

		act(() => {
			result.current.setValue(['value1', 'value2']);
		});

		expect(onChange).toHaveBeenCalledWith(['value1', 'value2']);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('updates internal state and calls onChange in uncontrolled mode', () => {
		const defaultValue = ['default1'];
		const onChange = vi.fn();

		const { result } = renderHook(() => useControlledValue(undefined, defaultValue, onChange));

		act(() => {
			result.current.setValue(['default1', 'default2']);
		});

		expect(result.current.currentValue).toEqual(['default1', 'default2']);
		expect(onChange).toHaveBeenCalledWith(['default1', 'default2']);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('does not call onChange when onChange is undefined', () => {
		const defaultValue = ['default1'];

		const { result } = renderHook(() => useControlledValue(undefined, defaultValue, undefined));

		act(() => {
			result.current.setValue(['default1', 'default2']);
		});

		expect(result.current.currentValue).toEqual(['default1', 'default2']);
	});

	it('handles empty array value', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() => useControlledValue(undefined, [], onChange));

		expect(result.current.currentValue).toEqual([]);

		act(() => {
			result.current.setValue(['new']);
		});

		expect(result.current.currentValue).toEqual(['new']);
		expect(onChange).toHaveBeenCalledWith(['new']);
	});

	it('memoizes setValue function', () => {
		const controlledValue = ['value1'];
		const onChange = vi.fn();

		const { result, rerender } = renderHook(
			({ value }) => useControlledValue(value, undefined, onChange),
			{
				initialProps: { value: controlledValue },
			}
		);

		const setValue1 = result.current.setValue;

		rerender({ value: controlledValue });
		const setValue2 = result.current.setValue;

		expect(setValue1).toBe(setValue2);
	});
});

describe('useTransferState', () => {
	it('should be a function', () => {
		expect(typeof useTransferState).toBe('function');
	});

	it('returns initial state with empty values', () => {
		const { result } = renderHook(() => useTransferState());

		expect(result.current.sourceSearchValue).toBe('');
		expect(result.current.targetSearchValue).toBe('');
		expect(result.current.selectedSourceValues).toEqual(new Set());
		expect(result.current.selectedTargetValues).toEqual(new Set());
	});

	it('returns setter functions', () => {
		const { result } = renderHook(() => useTransferState());

		expect(typeof result.current.setSourceSearchValue).toBe('function');
		expect(typeof result.current.setTargetSearchValue).toBe('function');
		expect(typeof result.current.setSelectedSourceValues).toBe('function');
		expect(typeof result.current.setSelectedTargetValues).toBe('function');
	});

	it('updates sourceSearchValue', () => {
		const { result } = renderHook(() => useTransferState());

		expect(result.current.sourceSearchValue).toBe('');

		act(() => {
			result.current.setSourceSearchValue('test search');
		});

		expect(result.current.sourceSearchValue).toBe('test search');
	});

	it('updates targetSearchValue', () => {
		const { result } = renderHook(() => useTransferState());

		expect(result.current.targetSearchValue).toBe('');

		act(() => {
			result.current.setTargetSearchValue('target search');
		});

		expect(result.current.targetSearchValue).toBe('target search');
	});

	it('updates selectedSourceValues with direct value', () => {
		const { result } = renderHook(() => useTransferState());

		expect(result.current.selectedSourceValues.size).toBe(0);

		act(() => {
			result.current.setSelectedSourceValues(new Set(['value1', 'value2']));
		});

		expect(result.current.selectedSourceValues).toEqual(new Set(['value1', 'value2']));
	});

	it('updates selectedSourceValues with updater function', () => {
		const { result } = renderHook(() => useTransferState());

		act(() => {
			result.current.setSelectedSourceValues(new Set(['value1']));
		});

		act(() => {
			result.current.setSelectedSourceValues(prev => {
				const next = new Set(prev);
				next.add('value2');
				return next;
			});
		});

		expect(result.current.selectedSourceValues).toEqual(new Set(['value1', 'value2']));
	});

	it('updates selectedTargetValues with direct value', () => {
		const { result } = renderHook(() => useTransferState());

		expect(result.current.selectedTargetValues.size).toBe(0);

		act(() => {
			result.current.setSelectedTargetValues(new Set(['value1', 'value2']));
		});

		expect(result.current.selectedTargetValues).toEqual(new Set(['value1', 'value2']));
	});

	it('updates selectedTargetValues with updater function', () => {
		const { result } = renderHook(() => useTransferState());

		act(() => {
			result.current.setSelectedTargetValues(new Set(['value1']));
		});

		act(() => {
			result.current.setSelectedTargetValues(prev => {
				const next = new Set(prev);
				next.add('value2');
				return next;
			});
		});

		expect(result.current.selectedTargetValues).toEqual(new Set(['value1', 'value2']));
	});

	it('handles empty string search values', () => {
		const { result } = renderHook(() => useTransferState());

		act(() => {
			result.current.setSourceSearchValue('test');
			result.current.setTargetSearchValue('test');
		});

		act(() => {
			result.current.setSourceSearchValue('');
			result.current.setTargetSearchValue('');
		});

		expect(result.current.sourceSearchValue).toBe('');
		expect(result.current.targetSearchValue).toBe('');
	});

	it('handles empty sets for selections', () => {
		const { result } = renderHook(() => useTransferState());

		act(() => {
			result.current.setSelectedSourceValues(new Set(['value1']));
			result.current.setSelectedTargetValues(new Set(['value1']));
		});

		act(() => {
			result.current.setSelectedSourceValues(new Set());
			result.current.setSelectedTargetValues(new Set());
		});

		expect(result.current.selectedSourceValues.size).toBe(0);
		expect(result.current.selectedTargetValues.size).toBe(0);
	});
});
