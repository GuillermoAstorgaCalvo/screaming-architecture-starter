/**
 * useMultiSelectKeyboard.navigation Tests
 *
 * Tests for multi-select keyboard navigation hooks:
 * - useArrowHandlers
 * - useHomeEndHandlers
 * - useNavigationHandlers
 */

import {
	useArrowHandlers,
	useHomeEndHandlers,
	useNavigationHandlers,
} from '@core/ui/forms/multi-select/hooks/useMultiSelectKeyboard.navigation';
import type { MultiSelectOption } from '@core/ui/forms/multi-select/MultiSelect';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const createTestOptions = (): MultiSelectOption[] => [
	{ value: '1', label: 'Option 1' },
	{ value: '2', label: 'Option 2', disabled: true },
	{ value: '3', label: 'Option 3' },
	{ value: '4', label: 'Option 4' },
];

describe('useArrowHandlers', () => {
	it('opens dropdown when arrow down is pressed and closed', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useArrowHandlers({
				isOpen: false,
				setIsOpen,
				filteredOptions: createTestOptions(),
				highlightedIndex: 0,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleArrowDown();
		});

		expect(setIsOpen).toHaveBeenCalledWith(true);
		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('moves to next enabled option when arrow down is pressed and open', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useArrowHandlers({
				isOpen: true,
				setIsOpen,
				filteredOptions: createTestOptions(),
				highlightedIndex: 0,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleArrowDown();
		});

		expect(setIsOpen).not.toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalledWith(2); // Skips disabled option at index 1
	});

	it('does nothing when arrow up is pressed and closed', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useArrowHandlers({
				isOpen: false,
				setIsOpen,
				filteredOptions: createTestOptions(),
				highlightedIndex: 0,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleArrowUp();
		});

		expect(setIsOpen).not.toHaveBeenCalled();
		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('moves to previous enabled option when arrow up is pressed and open', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useArrowHandlers({
				isOpen: true,
				setIsOpen,
				filteredOptions: createTestOptions(),
				highlightedIndex: 3,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleArrowUp();
		});

		expect(setIsOpen).not.toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalledWith(2); // Skips disabled option at index 1
	});

	it('wraps around when arrow down is pressed at last option', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
		];

		const { result } = renderHook(() =>
			useArrowHandlers({
				isOpen: true,
				setIsOpen,
				filteredOptions: options,
				highlightedIndex: 1,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleArrowDown();
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('wraps around when arrow up is pressed at first option', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
		];

		const { result } = renderHook(() =>
			useArrowHandlers({
				isOpen: true,
				setIsOpen,
				filteredOptions: options,
				highlightedIndex: 0,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleArrowUp();
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('does not update index when no enabled options found', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1', disabled: true },
			{ value: '2', label: 'Option 2', disabled: true },
		];

		const { result } = renderHook(() =>
			useArrowHandlers({
				isOpen: true,
				setIsOpen,
				filteredOptions: options,
				highlightedIndex: 0,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleArrowDown();
		});

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('returns handlers with correct structure', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useArrowHandlers({
				isOpen: true,
				setIsOpen,
				filteredOptions: createTestOptions(),
				highlightedIndex: 0,
				setHighlightedIndex,
			})
		);

		expect(result.current).toHaveProperty('handleArrowDown');
		expect(result.current).toHaveProperty('handleArrowUp');
		expect(typeof result.current.handleArrowDown).toBe('function');
		expect(typeof result.current.handleArrowUp).toBe('function');
	});
});

describe('useHomeEndHandlers', () => {
	it('does nothing when home is pressed and closed', () => {
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useHomeEndHandlers({
				isOpen: false,
				filteredOptions: createTestOptions(),
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleHome();
		});

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('moves to first enabled option when home is pressed and open', () => {
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useHomeEndHandlers({
				isOpen: true,
				filteredOptions: createTestOptions(),
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleHome();
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('skips disabled options when moving to first with home', () => {
		const setHighlightedIndex = vi.fn();
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1', disabled: true },
			{ value: '2', label: 'Option 2' },
			{ value: '3', label: 'Option 3' },
		];

		const { result } = renderHook(() =>
			useHomeEndHandlers({
				isOpen: true,
				filteredOptions: options,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleHome();
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('does nothing when end is pressed and closed', () => {
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useHomeEndHandlers({
				isOpen: false,
				filteredOptions: createTestOptions(),
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleEnd();
		});

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('moves to last enabled option when end is pressed and open', () => {
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useHomeEndHandlers({
				isOpen: true,
				filteredOptions: createTestOptions(),
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleEnd();
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(3);
	});

	it('skips disabled options when moving to last with end', () => {
		const setHighlightedIndex = vi.fn();
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
			{ value: '3', label: 'Option 3', disabled: true },
		];

		const { result } = renderHook(() =>
			useHomeEndHandlers({
				isOpen: true,
				filteredOptions: options,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleEnd();
		});

		expect(setHighlightedIndex).toHaveBeenCalledWith(1);
	});

	it('handles empty options array', () => {
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useHomeEndHandlers({
				isOpen: true,
				filteredOptions: [],
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleHome();
			result.current.handleEnd();
		});

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('handles all disabled options', () => {
		const setHighlightedIndex = vi.fn();
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1', disabled: true },
			{ value: '2', label: 'Option 2', disabled: true },
		];

		const { result } = renderHook(() =>
			useHomeEndHandlers({
				isOpen: true,
				filteredOptions: options,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleHome();
			result.current.handleEnd();
		});

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('returns handlers with correct structure', () => {
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useHomeEndHandlers({
				isOpen: true,
				filteredOptions: createTestOptions(),
				setHighlightedIndex,
			})
		);

		expect(result.current).toHaveProperty('handleHome');
		expect(result.current).toHaveProperty('handleEnd');
		expect(typeof result.current.handleHome).toBe('function');
		expect(typeof result.current.handleEnd).toBe('function');
	});
});

describe('useNavigationHandlers', () => {
	it('combines arrow and home/end handlers', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useNavigationHandlers({
				isOpen: true,
				setIsOpen,
				filteredOptions: createTestOptions(),
				highlightedIndex: 0,
				setHighlightedIndex,
			})
		);

		expect(result.current).toHaveProperty('handleArrowDown');
		expect(result.current).toHaveProperty('handleArrowUp');
		expect(result.current).toHaveProperty('handleHome');
		expect(result.current).toHaveProperty('handleEnd');
	});

	it('all handlers work correctly when combined', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
			{ value: '3', label: 'Option 3' },
		];

		const { result } = renderHook(() =>
			useNavigationHandlers({
				isOpen: true,
				setIsOpen,
				filteredOptions: options,
				highlightedIndex: 1,
				setHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleArrowDown();
		});
		expect(setHighlightedIndex).toHaveBeenCalledWith(2);

		act(() => {
			result.current.handleArrowUp();
		});
		expect(setHighlightedIndex).toHaveBeenCalledWith(0);

		act(() => {
			result.current.handleHome();
		});
		expect(setHighlightedIndex).toHaveBeenCalledWith(0);

		act(() => {
			result.current.handleEnd();
		});
		expect(setHighlightedIndex).toHaveBeenCalledWith(2);
	});

	it('returns all navigation handlers', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();

		const { result } = renderHook(() =>
			useNavigationHandlers({
				isOpen: true,
				setIsOpen,
				filteredOptions: createTestOptions(),
				highlightedIndex: 0,
				setHighlightedIndex,
			})
		);

		expect(result.current).toHaveProperty('handleArrowDown');
		expect(result.current).toHaveProperty('handleArrowUp');
		expect(result.current).toHaveProperty('handleHome');
		expect(result.current).toHaveProperty('handleEnd');
		expect(typeof result.current.handleArrowDown).toBe('function');
		expect(typeof result.current.handleArrowUp).toBe('function');
		expect(typeof result.current.handleHome).toBe('function');
		expect(typeof result.current.handleEnd).toBe('function');
	});
});
