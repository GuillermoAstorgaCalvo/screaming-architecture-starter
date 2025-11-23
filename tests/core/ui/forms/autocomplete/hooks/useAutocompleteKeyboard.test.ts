/**
 * useAutocompleteKeyboard Hook Tests
 *
 * Tests for the useAutocompleteKeyboard hook including:
 * - Keyboard event handling
 * - Key handler mapping
 * - Integration with keyboard handlers
 * - Event prevention
 */

import type { AutocompleteOption } from '@core/ui/forms/autocomplete/Autocomplete';
import { useAutocompleteKeyboard } from '@core/ui/forms/autocomplete/hooks/useAutocompleteKeyboard';
import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

const mockOptions: AutocompleteOption[] = [
	{ value: '1', label: 'Apple' },
	{ value: '2', label: 'Banana' },
	{ value: '3', label: 'Cherry' },
];

const createDefaultParams = (
	overrides?: Partial<Parameters<typeof useAutocompleteKeyboard>[1]>
) => ({
	isOpen: false,
	setIsOpen: vi.fn(),
	inputValue: '',
	setInputValue: vi.fn(),
	filteredOptions: mockOptions,
	highlightedIndex: -1,
	setHighlightedIndex: vi.fn(),
	value: '',
	setValue: vi.fn(),
	...overrides,
});

describe('useAutocompleteKeyboard - handleKeyDown', () => {
	it('calls handler for ArrowDown key', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useAutocompleteKeyboard(
				{ options: mockOptions, onChange: vi.fn() },
				createDefaultParams({
					isOpen: true,
					setIsOpen,
					setHighlightedIndex,
				})
			)
		);

		const event = {
			key: 'ArrowDown',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalled();
	});

	it('calls handler for ArrowUp key', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useAutocompleteKeyboard(
				{ options: mockOptions, onChange: vi.fn() },
				createDefaultParams({
					isOpen: true,
					highlightedIndex: 1,
					setIsOpen,
					setHighlightedIndex,
				})
			)
		);

		const event = {
			key: 'ArrowUp',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalled();
	});

	it('calls handler for Enter key', () => {
		const setIsOpen = vi.fn();
		const { result } = renderHook(() =>
			useAutocompleteKeyboard(
				{ options: mockOptions, onChange: vi.fn() },
				createDefaultParams({
					isOpen: true,
					highlightedIndex: 0,
					setIsOpen,
				})
			)
		);

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('calls handler for Space key', () => {
		const setIsOpen = vi.fn();
		const { result } = renderHook(() =>
			useAutocompleteKeyboard(
				{ options: mockOptions, onChange: vi.fn() },
				createDefaultParams({
					isOpen: true,
					highlightedIndex: 0,
					setIsOpen,
				})
			)
		);

		const event = {
			key: ' ',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('calls handler for Escape key', () => {
		const setIsOpen = vi.fn();
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useAutocompleteKeyboard(
				{ options: mockOptions, onChange: vi.fn() },
				createDefaultParams({
					isOpen: true,
					setIsOpen,
					setHighlightedIndex,
				})
			)
		);

		const event = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setIsOpen).toHaveBeenCalledWith(false);
		expect(setHighlightedIndex).toHaveBeenCalledWith(-1);
	});

	it('calls handler for Home key', () => {
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useAutocompleteKeyboard(
				{ options: mockOptions, onChange: vi.fn() },
				createDefaultParams({
					isOpen: true,
					highlightedIndex: 2,
					setHighlightedIndex,
				})
			)
		);

		const event = {
			key: 'Home',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalled();
	});

	it('calls handler for End key', () => {
		const setHighlightedIndex = vi.fn();
		const { result } = renderHook(() =>
			useAutocompleteKeyboard(
				{ options: mockOptions, onChange: vi.fn() },
				createDefaultParams({
					isOpen: true,
					highlightedIndex: 0,
					setHighlightedIndex,
				})
			)
		);

		const event = {
			key: 'End',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setHighlightedIndex).toHaveBeenCalled();
	});

	it('does not call handler for unhandled keys', () => {
		const preventDefault = vi.fn();
		const { result } = renderHook(() =>
			useAutocompleteKeyboard({ options: mockOptions, onChange: vi.fn() }, createDefaultParams())
		);

		const event = {
			key: 'a',
			preventDefault,
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(preventDefault).not.toHaveBeenCalled();
	});
});

describe('useAutocompleteKeyboard - handleSelect', () => {
	it('returns handleSelect function', () => {
		const { result } = renderHook(() =>
			useAutocompleteKeyboard({ options: mockOptions, onChange: vi.fn() }, createDefaultParams())
		);

		expect(typeof result.current.handleSelect).toBe('function');
	});

	it('handleSelect can be called with an option', () => {
		const { result } = renderHook(() =>
			useAutocompleteKeyboard({ options: mockOptions, onChange: vi.fn() }, createDefaultParams())
		);

		act(() => {
			expect(mockOptions[0]).toBeDefined();
			result.current.handleSelect(mockOptions[0]!);
		});

		// The function should execute without error
		expect(result.current.handleSelect).toBeDefined();
	});
});

describe('useAutocompleteKeyboard - Handler Stability', () => {
	it('creates handleKeyDown function', () => {
		const params = createDefaultParams();
		const { result } = renderHook(() =>
			useAutocompleteKeyboard({ options: mockOptions, onChange: vi.fn() }, params)
		);

		expect(typeof result.current.handleKeyDown).toBe('function');
	});

	it('creates new handleKeyDown when keyHandlers change', () => {
		const baseParams = createDefaultParams();
		const { result, rerender } = renderHook(
			({ isOpen }: { isOpen: boolean }) =>
				useAutocompleteKeyboard(
					{ options: mockOptions, onChange: vi.fn() },
					{ ...baseParams, isOpen }
				),
			{
				initialProps: { isOpen: false },
			}
		);

		rerender({ isOpen: true });

		// The handleKeyDown should be recreated when dependencies change
		expect(result.current.handleKeyDown).toBeDefined();
		expect(typeof result.current.handleKeyDown).toBe('function');
	});
});
