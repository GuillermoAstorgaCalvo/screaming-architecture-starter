/**
 * useAutocompleteComboboxHandlers.keyboard Tests
 *
 * Tests for the useKeyboardHandler hook:
 * - Arrow key navigation
 * - Enter key selection
 * - Escape key behavior
 * - Keyboard navigation edge cases
 */

import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import { useKeyboardHandler } from '@domains/shared/components/autocomplete-combobox/hooks/useAutocompleteComboboxHandlers.keyboard';
import { act, createEvent, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

const mockOptions: AutocompleteOption[] = [
	{ value: '1', label: 'Apple' },
	{ value: '2', label: 'Banana' },
	{ value: '3', label: 'Cherry' },
];

type HandlerParams = Parameters<typeof useKeyboardHandler>[0];

const createDefaultParams = (overrides?: Partial<HandlerParams>): HandlerParams => ({
	isOpen: false,
	filteredOptions: mockOptions,
	highlightedIndex: -1,
	openList: vi.fn(),
	moveHighlight: vi.fn(),
	selectOption: vi.fn(),
	closeList: vi.fn(),
	updateInputValue: vi.fn(),
	...overrides,
});

const createKeyboardEvent = (key: string): KeyboardEvent<HTMLInputElement> => {
	const event = createEvent.keyDown(document.createElement('input'), {
		key,
	}) as unknown as KeyboardEvent<HTMLInputElement>;
	event.preventDefault = vi.fn();
	return event;
};

const triggerKeyboardHandler = (
	handler: (event: KeyboardEvent<HTMLInputElement>) => void,
	event: KeyboardEvent<HTMLInputElement>
) => {
	act(() => {
		handler(event);
	});
};

describe('useKeyboardHandler', () => {
	describe('ArrowDown', () => {
		it('opens list and moves highlight when closed', () => {
			const openList = vi.fn();
			const moveHighlight = vi.fn();
			const { result } = renderHook(() =>
				useKeyboardHandler(createDefaultParams({ isOpen: false, openList, moveHighlight }))
			);

			const event = createKeyboardEvent('ArrowDown');
			triggerKeyboardHandler(result.current, event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(openList).toHaveBeenCalledTimes(1);
			expect(moveHighlight).toHaveBeenCalledWith(1);
		});

		it('moves highlight when already open', () => {
			const openList = vi.fn();
			const moveHighlight = vi.fn();
			const { result } = renderHook(() =>
				useKeyboardHandler(
					createDefaultParams({ isOpen: true, highlightedIndex: 0, openList, moveHighlight })
				)
			);

			const event = createKeyboardEvent('ArrowDown');
			triggerKeyboardHandler(result.current, event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(openList).not.toHaveBeenCalled();
			expect(moveHighlight).toHaveBeenCalledWith(1);
		});
	});

	describe('ArrowUp', () => {
		it('opens list and moves highlight when closed', () => {
			const openList = vi.fn();
			const moveHighlight = vi.fn();
			const { result } = renderHook(() =>
				useKeyboardHandler(createDefaultParams({ isOpen: false, openList, moveHighlight }))
			);

			const event = createKeyboardEvent('ArrowUp');
			triggerKeyboardHandler(result.current, event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(openList).toHaveBeenCalledTimes(1);
			expect(moveHighlight).toHaveBeenCalledWith(-1);
		});

		it('moves highlight when already open', () => {
			const openList = vi.fn();
			const moveHighlight = vi.fn();
			const { result } = renderHook(() =>
				useKeyboardHandler(
					createDefaultParams({ isOpen: true, highlightedIndex: 1, openList, moveHighlight })
				)
			);

			const event = createKeyboardEvent('ArrowUp');
			triggerKeyboardHandler(result.current, event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(openList).not.toHaveBeenCalled();
			expect(moveHighlight).toHaveBeenCalledWith(-1);
		});
	});
});

describe('useKeyboardHandler - Enter key', () => {
	describe('selection behavior', () => {
		it('selects highlighted option when list is open', () => {
			const selectOption = vi.fn();
			const { result } = renderHook(() =>
				useKeyboardHandler(createDefaultParams({ isOpen: true, highlightedIndex: 1, selectOption }))
			);

			const event = createKeyboardEvent('Enter');
			triggerKeyboardHandler(result.current, event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(selectOption).toHaveBeenCalledWith(mockOptions[1]);
		});
	});

	describe('edge cases', () => {
		it('does not select when list is closed', () => {
			const selectOption = vi.fn();
			const { result } = renderHook(() =>
				useKeyboardHandler(
					createDefaultParams({ isOpen: false, highlightedIndex: 1, selectOption })
				)
			);

			const event = createKeyboardEvent('Enter');
			triggerKeyboardHandler(result.current, event);

			expect(event.preventDefault).not.toHaveBeenCalled();
			expect(selectOption).not.toHaveBeenCalled();
		});

		it('does not select when no option is highlighted', () => {
			const selectOption = vi.fn();
			const { result } = renderHook(() =>
				useKeyboardHandler(
					createDefaultParams({ isOpen: true, highlightedIndex: -1, selectOption })
				)
			);

			const event = createKeyboardEvent('Enter');
			triggerKeyboardHandler(result.current, event);

			expect(event.preventDefault).toHaveBeenCalled();
			// When highlightedIndex is -1, filteredOptions[-1] is undefined, so selectOption is not called
			expect(selectOption).not.toHaveBeenCalled();
		});
	});
});

describe('useKeyboardHandler - Escape key', () => {
	describe('when list is open', () => {
		it('closes list when open', () => {
			const closeList = vi.fn();
			const { result } = renderHook(() =>
				useKeyboardHandler(createDefaultParams({ isOpen: true, highlightedIndex: 1, closeList }))
			);

			const event = createKeyboardEvent('Escape');
			triggerKeyboardHandler(result.current, event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(closeList).toHaveBeenCalledTimes(1);
		});
	});

	describe('when list is closed', () => {
		it('clears input and calls callbacks when closed', () => {
			const updateInputValue = vi.fn();
			const onValueChange = vi.fn();
			const onOptionSelect = vi.fn();
			const { result } = renderHook(() =>
				useKeyboardHandler(
					createDefaultParams({
						isOpen: false,
						updateInputValue,
						onValueChange,
						onOptionSelect,
					})
				)
			);

			const event = createKeyboardEvent('Escape');
			triggerKeyboardHandler(result.current, event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(updateInputValue).toHaveBeenCalledWith('');
			expect(onValueChange).toHaveBeenCalledWith(undefined);
			expect(onOptionSelect).toHaveBeenCalledWith(undefined);
		});

		it('clears input when callbacks are not provided', () => {
			const updateInputValue = vi.fn();
			const { result } = renderHook(() =>
				useKeyboardHandler(createDefaultParams({ isOpen: false, updateInputValue }))
			);

			const event = createKeyboardEvent('Escape');
			triggerKeyboardHandler(result.current, event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(updateInputValue).toHaveBeenCalledWith('');
		});
	});
});

describe('useKeyboardHandler - other behavior', () => {
	describe('Other keys', () => {
		it('ignores other keys', () => {
			const openList = vi.fn();
			const moveHighlight = vi.fn();
			const selectOption = vi.fn();
			const closeList = vi.fn();
			const { result } = renderHook(() =>
				useKeyboardHandler(
					createDefaultParams({
						isOpen: true,
						highlightedIndex: 1,
						openList,
						moveHighlight,
						selectOption,
						closeList,
					})
				)
			);

			const event = createKeyboardEvent('Tab');
			triggerKeyboardHandler(result.current, event);

			expect(openList).not.toHaveBeenCalled();
			expect(moveHighlight).not.toHaveBeenCalled();
			expect(selectOption).not.toHaveBeenCalled();
			expect(closeList).not.toHaveBeenCalled();
		});
	});

	describe('handler memoization', () => {
		it('maintains stable handler reference when params unchanged', () => {
			const params = createDefaultParams({ isOpen: true, highlightedIndex: 1 });
			const { result, rerender } = renderHook(() => useKeyboardHandler(params));

			const firstHandler = result.current;
			rerender();

			expect(result.current).toBe(firstHandler);
		});

		it('creates new handler when params change', () => {
			const baseParams = createDefaultParams({ highlightedIndex: 1 });
			const { result, rerender } = renderHook(
				({ isOpen }: { isOpen: boolean }) =>
					useKeyboardHandler({
						...baseParams,
						isOpen,
					}),
				{
					initialProps: { isOpen: true },
				}
			);

			const firstHandler = result.current;
			rerender({ isOpen: false });

			expect(result.current).not.toBe(firstHandler);
		});
	});
});
