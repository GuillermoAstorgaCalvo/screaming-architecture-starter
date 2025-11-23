/**
 * useAutocompleteComboboxState Tests
 *
 * Tests for the useAutocompleteComboboxState hook:
 * - Input value management
 * - Open state management
 * - Highlighted index management
 * - Selected option resolution
 * - Filtered options
 * - First enabled index
 */

import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import { useAutocompleteState } from '@domains/shared/components/autocomplete-combobox/hooks/useAutocompleteComboboxState';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const mockOptions: AutocompleteOption[] = [
	{ value: '1', label: 'Apple' },
	{ value: '2', label: 'Banana' },
	{ value: '3', label: 'Cherry' },
	{ value: '4', label: 'Date', disabled: true },
	{ value: '5', label: 'Elderberry' },
];

describe('useAutocompleteState - Input Value', () => {
	it('initializes with empty input when no value provided', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		expect(result.current.resolvedInputValue).toBe('');
		expect(result.current.isInputControlled).toBe(false);
	});

	it('initializes with option label when value matches', () => {
		const { result } = renderHook(() => useAutocompleteState('1', undefined, mockOptions));

		expect(result.current.resolvedInputValue).toBe('Apple');
	});

	it('uses controlled inputValue when provided', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, 'Controlled', mockOptions));

		expect(result.current.isInputControlled).toBe(true);
		expect(result.current.resolvedInputValue).toBe('Controlled');
	});

	it('updates internal input value', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		act(() => {
			result.current.setInternalInputValue('New value');
		});

		expect(result.current.resolvedInputValue).toBe('New value');
	});

	it('prioritizes controlled inputValue over selected option', () => {
		const { result } = renderHook(() => useAutocompleteState('1', 'Controlled', mockOptions));

		expect(result.current.resolvedInputValue).toBe('Controlled');
	});

	it('returns empty string when controlled inputValue is empty string', () => {
		const { result } = renderHook(() => useAutocompleteState('1', '', mockOptions));

		expect(result.current.isInputControlled).toBe(true);
		expect(result.current.resolvedInputValue).toBe('');
	});

	it('handles controlled inputValue with non-empty string', () => {
		// Test the branch where inputValue is a non-empty string
		const { result } = renderHook(() => useAutocompleteState('1', 'Custom Input', mockOptions));

		expect(result.current.isInputControlled).toBe(true);
		expect(result.current.resolvedInputValue).toBe('Custom Input');
	});

	it('updates resolved value when selected option changes', () => {
		const { result, rerender } = renderHook(
			({ value }: { value: string | undefined }) =>
				useAutocompleteState(value, undefined, mockOptions),
			{
				initialProps: { value: undefined as string | undefined },
			}
		);

		rerender({ value: '1' });

		expect(result.current.resolvedInputValue).toBe('Apple');
	});
});

describe('useAutocompleteState - Open State', () => {
	it('initializes with closed state', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		expect(result.current.isOpen).toBe(false);
	});

	it('opens listbox', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		act(() => {
			result.current.setIsOpen(true);
		});

		expect(result.current.isOpen).toBe(true);
	});

	it('closes listbox', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		act(() => {
			result.current.setIsOpen(true);
			result.current.setIsOpen(false);
		});

		expect(result.current.isOpen).toBe(false);
	});
});

describe('useAutocompleteState - Highlighted Index', () => {
	it('initializes with -1 highlighted index', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		expect(result.current.highlightedIndex).toBe(-1);
	});

	it('sets highlighted index', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		act(() => {
			result.current.setHighlightedIndex(2);
		});

		expect(result.current.highlightedIndex).toBe(2);
	});

	it('resets highlighted index', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		act(() => {
			result.current.setHighlightedIndex(2);
			result.current.setHighlightedIndex(-1);
		});

		expect(result.current.highlightedIndex).toBe(-1);
	});
});

describe('useAutocompleteState - Selected Option', () => {
	it('finds selected option by value', () => {
		const { result } = renderHook(() => useAutocompleteState('1', undefined, mockOptions));

		expect(result.current.selectedOption).toEqual(mockOptions[0]);
	});

	it('returns undefined when value does not match', () => {
		const { result } = renderHook(() => useAutocompleteState('999', undefined, mockOptions));

		expect(result.current.selectedOption).toBeUndefined();
	});

	it('returns undefined when value is undefined', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		expect(result.current.selectedOption).toBeUndefined();
	});

	it('updates selected option when value changes', () => {
		const { result, rerender } = renderHook(
			({ value }: { value: string | undefined }) =>
				useAutocompleteState(value, undefined, mockOptions),
			{
				initialProps: { value: undefined as string | undefined },
			}
		);

		rerender({ value: '2' });

		expect(result.current.selectedOption).toEqual(mockOptions[1]);
	});
});

describe('useAutocompleteState - Filtered Options', () => {
	it('returns all options when input is empty', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		expect(result.current.filteredOptions).toEqual(mockOptions);
	});

	it('filters options by label', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		act(() => {
			result.current.setInternalInputValue('App');
		});

		expect(result.current.filteredOptions).toHaveLength(1);
		expect(result.current.filteredOptions[0]?.label).toBe('Apple');
	});

	it('filters options case insensitively', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		act(() => {
			result.current.setInternalInputValue('ban');
		});

		expect(result.current.filteredOptions).toHaveLength(1);
		expect(result.current.filteredOptions[0]?.label).toBe('Banana');
	});

	it('filters options by keywords', () => {
		const optionsWithKeywords: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', keywords: ['red', 'fruit'] },
			{ value: '2', label: 'Banana', keywords: ['yellow'] },
		];

		const { result } = renderHook(() =>
			useAutocompleteState(undefined, undefined, optionsWithKeywords)
		);

		act(() => {
			result.current.setInternalInputValue('red');
		});

		expect(result.current.filteredOptions).toHaveLength(1);
		expect(result.current.filteredOptions[0]?.label).toBe('Apple');
	});

	it('updates filtered options when input changes', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		act(() => {
			result.current.setInternalInputValue('A');
		});

		const firstFilter = result.current.filteredOptions.length;

		act(() => {
			result.current.setInternalInputValue('Ap');
		});

		expect(result.current.filteredOptions.length).toBeLessThanOrEqual(firstFilter);
	});
});

describe('useAutocompleteState - First Enabled Index', () => {
	it('finds first enabled option', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		expect(result.current.firstEnabledIndex).toBe(0);
	});

	it('returns -1 when all options are disabled', () => {
		const allDisabled: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', disabled: true },
			{ value: '2', label: 'Banana', disabled: true },
		];

		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, allDisabled));

		expect(result.current.firstEnabledIndex).toBe(-1);
	});

	it('finds first enabled option after disabled ones', () => {
		const optionsWithDisabledFirst: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', disabled: true },
			{ value: '2', label: 'Banana' },
		];

		const { result } = renderHook(() =>
			useAutocompleteState(undefined, undefined, optionsWithDisabledFirst)
		);

		expect(result.current.firstEnabledIndex).toBe(1);
	});

	it('updates first enabled index when options change', () => {
		const { result, rerender } = renderHook(
			({ options }: { options: AutocompleteOption[] }) =>
				useAutocompleteState(undefined, undefined, options),
			{
				initialProps: { options: mockOptions },
			}
		);

		const initialIndex = result.current.firstEnabledIndex;
		expect(initialIndex).toBeGreaterThanOrEqual(0);

		const newOptions: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', disabled: true },
			{ value: '2', label: 'Banana' },
		];

		rerender({ options: newOptions });

		expect(result.current.firstEnabledIndex).toBe(1);
		expect(result.current.firstEnabledIndex).not.toBe(initialIndex);
	});
});

describe('useAutocompleteState - Integration', () => {
	it('handles complete selection flow', () => {
		const { result } = renderHook(() => useAutocompleteState(undefined, undefined, mockOptions));

		// Start with empty input
		expect(result.current.resolvedInputValue).toBe('');
		expect(result.current.isOpen).toBe(false);

		// Type to filter
		act(() => {
			result.current.setInternalInputValue('App');
		});

		expect(result.current.filteredOptions).toHaveLength(1);

		// Open listbox
		act(() => {
			result.current.setIsOpen(true);
		});

		expect(result.current.isOpen).toBe(true);

		// Highlight option
		act(() => {
			result.current.setHighlightedIndex(0);
		});

		expect(result.current.highlightedIndex).toBe(0);
	});

	it('maintains state consistency', () => {
		const { result } = renderHook(() => useAutocompleteState('1', undefined, mockOptions));

		expect(result.current.selectedOption).toEqual(mockOptions[0]);
		expect(result.current.resolvedInputValue).toBe('Apple');
		expect(result.current.filteredOptions).toContain(mockOptions[0]);
	});
});
