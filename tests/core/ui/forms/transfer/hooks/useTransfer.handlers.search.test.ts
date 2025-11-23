/**
 * useTransfer.handlers.search Tests
 *
 * Tests for search change handlers:
 * - useSearchHandlers
 */

import { useSearchHandlers } from '@core/ui/forms/transfer/hooks/useTransfer.handlers.search';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useSearchHandlers', () => {
	it('should be a function', () => {
		expect(typeof useSearchHandlers).toBe('function');
	});

	it('returns handler functions', () => {
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSearchHandlers({
				setSourceSearchValue,
				setTargetSearchValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		expect(typeof result.current.handleSourceSearchChange).toBe('function');
		expect(typeof result.current.handleTargetSearchChange).toBe('function');
	});

	it('updates source search value', () => {
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSearchHandlers({
				setSourceSearchValue,
				setTargetSearchValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleSourceSearchChange('test search');
		});

		expect(setSourceSearchValue).toHaveBeenCalledWith('test search');
		expect(setSourceSearchValue).toHaveBeenCalledTimes(1);
	});

	it('clears source selection when search changes', () => {
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSearchHandlers({
				setSourceSearchValue,
				setTargetSearchValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleSourceSearchChange('test');
		});

		expect(setSelectedSourceValues).toHaveBeenCalledWith(new Set());
		expect(setSelectedSourceValues).toHaveBeenCalledTimes(1);
	});

	it('updates target search value', () => {
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSearchHandlers({
				setSourceSearchValue,
				setTargetSearchValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleTargetSearchChange('target search');
		});

		expect(setTargetSearchValue).toHaveBeenCalledWith('target search');
		expect(setTargetSearchValue).toHaveBeenCalledTimes(1);
	});

	it('clears target selection when search changes', () => {
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSearchHandlers({
				setSourceSearchValue,
				setTargetSearchValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleTargetSearchChange('test');
		});

		expect(setSelectedTargetValues).toHaveBeenCalledWith(new Set());
		expect(setSelectedTargetValues).toHaveBeenCalledTimes(1);
	});

	it('handles empty string search value', () => {
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSearchHandlers({
				setSourceSearchValue,
				setTargetSearchValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleSourceSearchChange('');
			result.current.handleTargetSearchChange('');
		});

		expect(setSourceSearchValue).toHaveBeenCalledWith('');
		expect(setTargetSearchValue).toHaveBeenCalledWith('');
	});

	it('handles multiple search changes', () => {
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result } = renderHook(() =>
			useSearchHandlers({
				setSourceSearchValue,
				setTargetSearchValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		act(() => {
			result.current.handleSourceSearchChange('first');
			result.current.handleSourceSearchChange('second');
			result.current.handleTargetSearchChange('first');
			result.current.handleTargetSearchChange('second');
		});

		expect(setSourceSearchValue).toHaveBeenCalledTimes(2);
		expect(setTargetSearchValue).toHaveBeenCalledTimes(2);
		expect(setSelectedSourceValues).toHaveBeenCalledTimes(2);
		expect(setSelectedTargetValues).toHaveBeenCalledTimes(2);
	});

	it('memoizes handlers', () => {
		const setSourceSearchValue = vi.fn();
		const setTargetSearchValue = vi.fn();
		const setSelectedSourceValues = vi.fn();
		const setSelectedTargetValues = vi.fn();

		const { result, rerender } = renderHook(() =>
			useSearchHandlers({
				setSourceSearchValue,
				setTargetSearchValue,
				setSelectedSourceValues,
				setSelectedTargetValues,
			})
		);

		const handleSource1 = result.current.handleSourceSearchChange;
		const handleTarget1 = result.current.handleTargetSearchChange;

		rerender();

		const handleSource2 = result.current.handleSourceSearchChange;
		const handleTarget2 = result.current.handleTargetSearchChange;

		expect(handleSource1).toBe(handleSource2);
		expect(handleTarget1).toBe(handleTarget2);
	});
});
