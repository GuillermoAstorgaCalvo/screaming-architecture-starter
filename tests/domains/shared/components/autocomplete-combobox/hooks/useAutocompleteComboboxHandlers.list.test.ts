/**
 * useAutocompleteComboboxHandlers.list Tests
 *
 * Tests for the useListCallbacks hook:
 * - Opening list
 * - Closing list
 * - Disabled state handling
 * - Highlight index management
 */

import { useListCallbacks } from '@domains/shared/components/autocomplete-combobox/hooks/useAutocompleteComboboxHandlers.list';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useListCallbacks - openList basic behavior', () => {
	it('opens list when not disabled', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useListCallbacks({
				disabled: false,
				firstEnabledIndex: 0,
				setIsOpen,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.openList();
		});

		expect(setIsOpen).toHaveBeenCalledWith(true);
		expect(setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('does not open list when disabled', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useListCallbacks({
				disabled: true,
				firstEnabledIndex: 0,
				setIsOpen,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.openList();
		});

		expect(setIsOpen).not.toHaveBeenCalled();
		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});
});

describe('useListCallbacks - openList highlight index handling', () => {
	it('sets highlighted index to -1 when no enabled options', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useListCallbacks({
				disabled: false,
				firstEnabledIndex: -1,
				setIsOpen,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.openList();
		});

		expect(setIsOpen).toHaveBeenCalledWith(true);
		expect(setHighlightedIndex).toHaveBeenCalledWith(-1);
	});

	it('sets highlighted index to first enabled index when available', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useListCallbacks({
				disabled: false,
				firstEnabledIndex: 2,
				setIsOpen,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.openList();
		});

		expect(setIsOpen).toHaveBeenCalledWith(true);
		expect(setHighlightedIndex).toHaveBeenCalledWith(2);
	});
});

describe('useListCallbacks - closeList', () => {
	it('closes list and resets highlight', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useListCallbacks({
				disabled: false,
				firstEnabledIndex: 0,
				setIsOpen,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.closeList();
		});

		expect(setIsOpen).toHaveBeenCalledWith(false);
		expect(setHighlightedIndex).toHaveBeenCalledWith(-1);
	});

	it('closes list even when disabled', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useListCallbacks({
				disabled: true,
				firstEnabledIndex: 0,
				setIsOpen,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.closeList();
		});

		expect(setIsOpen).toHaveBeenCalledWith(false);
		expect(setHighlightedIndex).toHaveBeenCalledWith(-1);
	});
});

describe('useListCallbacks - callback memoization', () => {
	it('creates new openList when disabled changes', () => {
		const { result, rerender } = renderHook(
			({ disabled }: { disabled: boolean }) =>
				useListCallbacks({
					disabled,
					firstEnabledIndex: 0,
					setIsOpen: vi.fn(),
					setHighlightedIndex: vi.fn(),
				}),
			{
				initialProps: { disabled: false },
			}
		);

		const firstOpen = result.current.openList;

		rerender({ disabled: true });

		expect(result.current.openList).not.toBe(firstOpen);
	});

	it('creates new openList when firstEnabledIndex changes', () => {
		const { result, rerender } = renderHook(
			({ firstEnabledIndex }: { firstEnabledIndex: number }) =>
				useListCallbacks({
					disabled: false,
					firstEnabledIndex,
					setIsOpen: vi.fn(),
					setHighlightedIndex: vi.fn(),
				}),
			{
				initialProps: { firstEnabledIndex: 0 },
			}
		);

		const firstOpen = result.current.openList;

		rerender({ firstEnabledIndex: 1 });

		expect(result.current.openList).not.toBe(firstOpen);
	});

	it('maintains stable closeList reference', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const { result, rerender } = renderHook(
			({ disabled }: { disabled: boolean }) =>
				useListCallbacks({
					disabled,
					firstEnabledIndex: 0,
					setIsOpen,
					setHighlightedIndex,
				}),
			{
				initialProps: { disabled: false },
			}
		);

		const firstClose = result.current.closeList;

		rerender({ disabled: true });

		expect(result.current.closeList).toBe(firstClose);
	});
});

describe('useListCallbacks - integration', () => {
	it('handles open and close sequence', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useListCallbacks({
				disabled: false,
				firstEnabledIndex: 1,
				setIsOpen,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.openList();
		});

		expect(setIsOpen).toHaveBeenCalledWith(true);
		expect(setHighlightedIndex).toHaveBeenCalledWith(1);

		act(() => {
			result.current.closeList();
		});

		expect(setIsOpen).toHaveBeenLastCalledWith(false);
		expect(setHighlightedIndex).toHaveBeenLastCalledWith(-1);
	});
});
