/**
 * useTransfer.handlers.move Tests
 *
 * Tests for move handlers:
 * - useMoveHandlers
 * - useMoveToTargetHandler
 * - useMoveToSourceHandler
 */

import { useMoveHandlers } from '@core/ui/forms/transfer/hooks/useTransfer.handlers.move';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useMoveHandlers', () => {
	it('should be a function', () => {
		expect(typeof useMoveHandlers).toBe('function');
	});

	it('returns move handler functions', () => {
		const setValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();

		const { result } = renderHook(() =>
			useMoveHandlers({
				disabled: false,
				currentValue: [],
				selectedSourceValues: new Set(),
				selectedTargetValues: new Set(),
				setValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
				setSourceSearchValue,
				setTargetSearchValue,
			})
		);

		expect(typeof result.current.handleMoveToTarget).toBe('function');
		expect(typeof result.current.handleMoveToSource).toBe('function');
	});

	it('moves items from source to target', () => {
		const setValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();

		const { result } = renderHook(() =>
			useMoveHandlers({
				disabled: false,
				currentValue: ['existing'],
				selectedSourceValues: new Set(['value1', 'value2']),
				selectedTargetValues: new Set(),
				setValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
				setSourceSearchValue,
				setTargetSearchValue,
			})
		);

		act(() => {
			result.current.handleMoveToTarget();
		});

		expect(setValue).toHaveBeenCalledWith(['existing', 'value1', 'value2']);
		expect(setSelectedSourceValues).toHaveBeenCalledWith(new Set());
		expect(setSourceSearchValue).toHaveBeenCalledWith('');
	});

	it('moves items from target to source', () => {
		const setValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();

		const { result } = renderHook(() =>
			useMoveHandlers({
				disabled: false,
				currentValue: ['value1', 'value2', 'value3'],
				selectedSourceValues: new Set(),
				selectedTargetValues: new Set(['value1', 'value3']),
				setValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
				setSourceSearchValue,
				setTargetSearchValue,
			})
		);

		act(() => {
			result.current.handleMoveToSource();
		});

		expect(setValue).toHaveBeenCalledWith(['value2']);
		expect(setSelectedTargetValues).toHaveBeenCalledWith(new Set());
		expect(setTargetSearchValue).toHaveBeenCalledWith('');
	});

	it('does not move when disabled', () => {
		const setValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();

		const { result } = renderHook(() =>
			useMoveHandlers({
				disabled: true,
				currentValue: [],
				selectedSourceValues: new Set(['value1']),
				selectedTargetValues: new Set(['value2']),
				setValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
				setSourceSearchValue,
				setTargetSearchValue,
			})
		);

		act(() => {
			result.current.handleMoveToTarget();
			result.current.handleMoveToSource();
		});

		expect(setValue).not.toHaveBeenCalled();
		expect(setSelectedSourceValues).not.toHaveBeenCalled();
		expect(setSelectedTargetValues).not.toHaveBeenCalled();
	});

	it('does not move when no source items selected', () => {
		const setValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();

		const { result } = renderHook(() =>
			useMoveHandlers({
				disabled: false,
				currentValue: [],
				selectedSourceValues: new Set(),
				selectedTargetValues: new Set(),
				setValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
				setSourceSearchValue,
				setTargetSearchValue,
			})
		);

		act(() => {
			result.current.handleMoveToTarget();
		});

		expect(setValue).not.toHaveBeenCalled();
		expect(setSelectedSourceValues).not.toHaveBeenCalled();
		expect(setSourceSearchValue).not.toHaveBeenCalled();
	});

	it('does not move when no target items selected', () => {
		const setValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();

		const { result } = renderHook(() =>
			useMoveHandlers({
				disabled: false,
				currentValue: ['value1'],
				selectedSourceValues: new Set(),
				selectedTargetValues: new Set(),
				setValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
				setSourceSearchValue,
				setTargetSearchValue,
			})
		);

		act(() => {
			result.current.handleMoveToSource();
		});

		expect(setValue).not.toHaveBeenCalled();
		expect(setSelectedTargetValues).not.toHaveBeenCalled();
		expect(setTargetSearchValue).not.toHaveBeenCalled();
	});

	it('handles empty currentValue when moving to target', () => {
		const setValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();

		const { result } = renderHook(() =>
			useMoveHandlers({
				disabled: false,
				currentValue: [],
				selectedSourceValues: new Set(['value1']),
				selectedTargetValues: new Set(),
				setValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
				setSourceSearchValue,
				setTargetSearchValue,
			})
		);

		act(() => {
			result.current.handleMoveToTarget();
		});

		expect(setValue).toHaveBeenCalledWith(['value1']);
	});

	it('handles removing all items from target', () => {
		const setValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();

		const { result } = renderHook(() =>
			useMoveHandlers({
				disabled: false,
				currentValue: ['value1', 'value2'],
				selectedSourceValues: new Set(),
				selectedTargetValues: new Set(['value1', 'value2']),
				setValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
				setSourceSearchValue,
				setTargetSearchValue,
			})
		);

		act(() => {
			result.current.handleMoveToSource();
		});

		expect(setValue).toHaveBeenCalledWith([]);
	});

	it('handles multiple moves correctly', () => {
		const setValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();

		let currentValue: string[] = [];

		const { result, rerender } = renderHook(
			({
				currentValue: cv,
				selectedSource,
				selectedTarget,
			}: {
				currentValue: string[];
				selectedSource: Set<string>;
				selectedTarget: Set<string>;
			}) =>
				useMoveHandlers({
					disabled: false,
					currentValue: cv,
					selectedSourceValues: selectedSource,
					selectedTargetValues: selectedTarget,
					setValue: newValue => {
						currentValue = newValue;
						setValue(newValue);
					},
					setSelectedSourceValues,
					setSelectedTargetValues,
					setSourceSearchValue,
					setTargetSearchValue,
				}),
			{
				initialProps: {
					currentValue: [] as string[],
					selectedSource: new Set<string>(['value1']),
					selectedTarget: new Set<string>(),
				},
			}
		);

		act(() => {
			result.current.handleMoveToTarget();
		});

		expect(currentValue).toEqual(['value1']);

		rerender({
			currentValue: ['value1'],
			selectedSource: new Set(),
			selectedTarget: new Set(['value1']),
		});

		act(() => {
			result.current.handleMoveToSource();
		});

		expect(currentValue).toEqual([]);
	});

	it('memoizes handlers when dependencies do not change', () => {
		const setValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();
		const selectedSourceValues = new Set<string>();
		const selectedTargetValues = new Set<string>();
		const currentValue: string[] = [];

		const { result, rerender } = renderHook(
			() =>
				useMoveHandlers({
					disabled: false,
					currentValue,
					selectedSourceValues,
					selectedTargetValues,
					setValue,
					setSelectedSourceValues,
					setSelectedTargetValues,
					setSourceSearchValue,
					setTargetSearchValue,
				}),
			{
				initialProps: {},
			}
		);

		const handleMoveToTarget1 = result.current.handleMoveToTarget;
		const handleMoveToSource1 = result.current.handleMoveToSource;

		rerender();

		const handleMoveToTarget2 = result.current.handleMoveToTarget;
		const handleMoveToSource2 = result.current.handleMoveToSource;

		expect(handleMoveToTarget1).toBe(handleMoveToTarget2);
		expect(handleMoveToSource1).toBe(handleMoveToSource2);
	});
});
