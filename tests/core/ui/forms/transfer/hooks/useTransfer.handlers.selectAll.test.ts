/**
 * useTransfer.handlers.selectAll Tests
 *
 * Tests for select all/none handlers:
 * - useSelectAllHandlers
 */

import { useSelectAllHandlers } from '@core/ui/forms/transfer/hooks/useTransfer.handlers.selectAll';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const createMockOption = (value: string, disabled = false) => ({
	value,
	label: `Label ${value}`,
	disabled,
});

describe('useSelectAllHandlers', () => {
	it('should be a function', () => {
		expect(typeof useSelectAllHandlers).toBe('function');
	});

	it('returns all handler functions', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSelectAllHandlers({
				disabled: false,
				filteredSourceOptions: [],
				filteredTargetOptions: [],
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		expect(typeof result.current.handleSourceSelectAll).toBe('function');
		expect(typeof result.current.handleSourceSelectNone).toBe('function');
		expect(typeof result.current.handleTargetSelectAll).toBe('function');
		expect(typeof result.current.handleTargetSelectNone).toBe('function');
	});

	it('selects all enabled source options', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const options = [
			createMockOption('value1'),
			createMockOption('value2', true), // disabled
			createMockOption('value3'),
		];

		const { result } = renderHook(() =>
			useSelectAllHandlers({
				disabled: false,
				filteredSourceOptions: options,
				filteredTargetOptions: [],
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleSourceSelectAll();
		});

		expect(setSelectedSourceValues).toHaveBeenCalledWith(new Set(['value1', 'value3']));
		expect(setSelectedSourceValues).toHaveBeenCalledTimes(1);
	});

	it('selects all enabled target options', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const options = [
			createMockOption('value1'),
			createMockOption('value2', true), // disabled
			createMockOption('value3'),
		];

		const { result } = renderHook(() =>
			useSelectAllHandlers({
				disabled: false,
				filteredSourceOptions: [],
				filteredTargetOptions: options,
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleTargetSelectAll();
		});

		expect(setSelectedTargetValues).toHaveBeenCalledWith(new Set(['value1', 'value3']));
		expect(setSelectedTargetValues).toHaveBeenCalledTimes(1);
	});

	it('clears source selection', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSelectAllHandlers({
				disabled: false,
				filteredSourceOptions: [],
				filteredTargetOptions: [],
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleSourceSelectNone();
		});

		expect(setSelectedSourceValues).toHaveBeenCalledWith(new Set());
		expect(setSelectedSourceValues).toHaveBeenCalledTimes(1);
	});

	it('clears target selection', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSelectAllHandlers({
				disabled: false,
				filteredSourceOptions: [],
				filteredTargetOptions: [],
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleTargetSelectNone();
		});

		expect(setSelectedTargetValues).toHaveBeenCalledWith(new Set());
		expect(setSelectedTargetValues).toHaveBeenCalledTimes(1);
	});

	it('does not select when disabled', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const options = [createMockOption('value1'), createMockOption('value2')];

		const { result } = renderHook(() =>
			useSelectAllHandlers({
				disabled: true,
				filteredSourceOptions: options,
				filteredTargetOptions: options,
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleSourceSelectAll();
			result.current.handleTargetSelectAll();
			result.current.handleSourceSelectNone();
			result.current.handleTargetSelectNone();
		});

		expect(setSelectedSourceValues).not.toHaveBeenCalled();
		expect(setSelectedTargetValues).not.toHaveBeenCalled();
	});

	it('handles empty options arrays', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSelectAllHandlers({
				disabled: false,
				filteredSourceOptions: [],
				filteredTargetOptions: [],
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleSourceSelectAll();
			result.current.handleTargetSelectAll();
		});

		expect(setSelectedSourceValues).toHaveBeenCalledWith(new Set());
		expect(setSelectedTargetValues).toHaveBeenCalledWith(new Set());
	});

	it('handles all disabled options', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const options = [createMockOption('value1', true), createMockOption('value2', true)];

		const { result } = renderHook(() =>
			useSelectAllHandlers({
				disabled: false,
				filteredSourceOptions: options,
				filteredTargetOptions: options,
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleSourceSelectAll();
			result.current.handleTargetSelectAll();
		});

		expect(setSelectedSourceValues).toHaveBeenCalledWith(new Set());
		expect(setSelectedTargetValues).toHaveBeenCalledWith(new Set());
	});

	it('memoizes handlers when dependencies do not change', () => {
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();
		const filteredSourceOptions: ReturnType<typeof createMockOption>[] = [];
		const filteredTargetOptions: ReturnType<typeof createMockOption>[] = [];

		const { result, rerender } = renderHook(
			() =>
				useSelectAllHandlers({
					disabled: false,
					filteredSourceOptions,
					filteredTargetOptions,
					setSelectedSourceValues,
					setSelectedTargetValues,
				}),
			{
				initialProps: {},
			}
		);

		const handleSourceAll1 = result.current.handleSourceSelectAll;
		const handleSourceNone1 = result.current.handleSourceSelectNone;
		const handleTargetAll1 = result.current.handleTargetSelectAll;
		const handleTargetNone1 = result.current.handleTargetSelectNone;

		rerender();

		const handleSourceAll2 = result.current.handleSourceSelectAll;
		const handleSourceNone2 = result.current.handleSourceSelectNone;
		const handleTargetAll2 = result.current.handleTargetSelectAll;
		const handleTargetNone2 = result.current.handleTargetSelectNone;

		expect(handleSourceAll1).toBe(handleSourceAll2);
		expect(handleSourceNone1).toBe(handleSourceNone2);
		expect(handleTargetAll1).toBe(handleTargetAll2);
		expect(handleTargetNone1).toBe(handleTargetNone2);
	});
});
