/**
 * useTransfer.handlers.selection Tests
 *
 * Tests for selection toggle handlers:
 * - useSelectionHandlers
 */

import { useSelectionHandlers } from '@core/ui/forms/transfer/hooks/useTransfer.handlers.selection';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useSelectionHandlers', () => {
	it('should be a function', () => {
		expect(typeof useSelectionHandlers).toBe('function');
	});

	it('returns handler functions', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSelectionHandlers(false, setSelectedSourceValues, setSelectedTargetValues)
		);

		expect(typeof result.current.handleSourceItemToggle).toBe('function');
		expect(typeof result.current.handleTargetItemToggle).toBe('function');
	});

	it('toggles source item selection when not disabled', () => {
		const setSelectedSourceValues = vi.fn(
			(value: Set<string> | ((prev: Set<string>) => Set<string>)) => {
				if (typeof value === 'function') {
					const prev = new Set(['existing']);
					return value(prev);
				}
				return value;
			}
		);
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSelectionHandlers(false, setSelectedSourceValues, setSelectedTargetValues)
		);

		act(() => {
			result.current.handleSourceItemToggle('value1');
		});

		expect(setSelectedSourceValues).toHaveBeenCalled();
	});

	it('adds source item when not in selection', () => {
		let currentSet = new Set<string>();
		const setSelectedSourceValues = vi.fn(
			(value: Set<string> | ((prev: Set<string>) => Set<string>)) => {
				currentSet = typeof value === 'function' ? value(currentSet) : value;
			}
		);
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSelectionHandlers(false, setSelectedSourceValues, setSelectedTargetValues)
		);

		act(() => {
			result.current.handleSourceItemToggle('value1');
		});

		expect(currentSet.has('value1')).toBe(true);
	});

	it('removes source item when already in selection', () => {
		let currentSet = new Set(['value1']);
		const setSelectedSourceValues = vi.fn(
			(value: Set<string> | ((prev: Set<string>) => Set<string>)) => {
				currentSet = typeof value === 'function' ? value(currentSet) : value;
			}
		);
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSelectionHandlers(false, setSelectedSourceValues, setSelectedTargetValues)
		);

		act(() => {
			result.current.handleSourceItemToggle('value1');
		});

		expect(currentSet.has('value1')).toBe(false);
	});

	it('toggles target item selection when not disabled', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn(
			(value: Set<string> | ((prev: Set<string>) => Set<string>)) => {
				if (typeof value === 'function') {
					const prev = new Set(['existing']);
					return value(prev);
				}
				return value;
			}
		);

		const { result } = renderHook(() =>
			useSelectionHandlers(false, setSelectedSourceValues, setSelectedTargetValues)
		);

		act(() => {
			result.current.handleTargetItemToggle('value1');
		});

		expect(setSelectedTargetValues).toHaveBeenCalled();
	});

	it('adds target item when not in selection', () => {
		const setSelectedSourceValues = vi.fn();
		let currentSet = new Set<string>();
		const setSelectedTargetValues = vi.fn(
			(value: Set<string> | ((prev: Set<string>) => Set<string>)) => {
				currentSet = typeof value === 'function' ? value(currentSet) : value;
			}
		);

		const { result } = renderHook(() =>
			useSelectionHandlers(false, setSelectedSourceValues, setSelectedTargetValues)
		);

		act(() => {
			result.current.handleTargetItemToggle('value1');
		});

		expect(currentSet.has('value1')).toBe(true);
	});

	it('removes target item when already in selection', () => {
		const setSelectedSourceValues = vi.fn();
		let currentSet = new Set(['value1']);
		const setSelectedTargetValues = vi.fn(
			(value: Set<string> | ((prev: Set<string>) => Set<string>)) => {
				currentSet = typeof value === 'function' ? value(currentSet) : value;
			}
		);

		const { result } = renderHook(() =>
			useSelectionHandlers(false, setSelectedSourceValues, setSelectedTargetValues)
		);

		act(() => {
			result.current.handleTargetItemToggle('value1');
		});

		expect(currentSet.has('value1')).toBe(false);
	});

	it('does not toggle source item when disabled', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSelectionHandlers(true, setSelectedSourceValues, setSelectedTargetValues)
		);

		act(() => {
			result.current.handleSourceItemToggle('value1');
		});

		expect(setSelectedSourceValues).not.toHaveBeenCalled();
	});

	it('does not toggle target item when disabled', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSelectionHandlers(true, setSelectedSourceValues, setSelectedTargetValues)
		);

		act(() => {
			result.current.handleTargetItemToggle('value1');
		});

		expect(setSelectedTargetValues).not.toHaveBeenCalled();
	});

	it('handles multiple toggles correctly', () => {
		let sourceSet = new Set<string>();
		const setSelectedSourceValues = vi.fn(
			(value: Set<string> | ((prev: Set<string>) => Set<string>)) => {
				sourceSet = typeof value === 'function' ? value(sourceSet) : value;
			}
		);
		let targetSet = new Set<string>();
		const setSelectedTargetValues = vi.fn(
			(value: Set<string> | ((prev: Set<string>) => Set<string>)) => {
				targetSet = typeof value === 'function' ? value(targetSet) : value;
			}
		);

		const { result } = renderHook(() =>
			useSelectionHandlers(false, setSelectedSourceValues, setSelectedTargetValues)
		);

		act(() => {
			result.current.handleSourceItemToggle('value1');
			result.current.handleSourceItemToggle('value2');
			result.current.handleTargetItemToggle('value3');
			result.current.handleTargetItemToggle('value4');
		});

		expect(sourceSet.has('value1')).toBe(true);
		expect(sourceSet.has('value2')).toBe(true);
		expect(targetSet.has('value3')).toBe(true);
		expect(targetSet.has('value4')).toBe(true);
	});

	it('memoizes handlers', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result, rerender } = renderHook(
			({ disabled }) =>
				useSelectionHandlers(disabled, setSelectedSourceValues, setSelectedTargetValues),
			{
				initialProps: { disabled: false },
			}
		);

		const handleSource1 = result.current.handleSourceItemToggle;
		const handleTarget1 = result.current.handleTargetItemToggle;

		rerender({ disabled: false });

		const handleSource2 = result.current.handleSourceItemToggle;
		const handleTarget2 = result.current.handleTargetItemToggle;

		expect(handleSource1).toBe(handleSource2);
		expect(handleTarget1).toBe(handleTarget2);
	});
});
