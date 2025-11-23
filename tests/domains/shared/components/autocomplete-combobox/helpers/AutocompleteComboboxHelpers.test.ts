/**
 * AutocompleteComboboxHelpers Tests
 *
 * Tests for helper functions:
 * - filterOptions
 * - findNextEnabledIndex
 * - getActiveDescendant
 * - buildComboboxBodyProps
 */

import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import {
	buildComboboxBodyProps,
	filterOptions,
	findNextEnabledIndex,
	getActiveDescendant,
} from '@domains/shared/components/autocomplete-combobox/helpers/AutocompleteComboboxHelpers';
import type { RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';

const mockOptions: AutocompleteOption[] = [
	{ value: '1', label: 'Apple' },
	{ value: '2', label: 'Banana' },
	{ value: '3', label: 'Cherry' },
	{ value: '4', label: 'Date', disabled: true },
	{ value: '5', label: 'Elderberry' },
];

const COMBOBOX_ID = 'combobox-1';
const TEST_COMBOBOX_ID = 'test-combobox';
const LOADING_MESSAGE = 'Loading...';
const NO_OPTIONS_MESSAGE = 'No matches';

function createMockHandlers() {
	return {
		handleChange: vi.fn(),
		openList: vi.fn(),
		handleKeyDown: vi.fn(),
		selectOption: vi.fn(),
	};
}

function createBaseParams(overrides?: Record<string, unknown>) {
	const handlers = createMockHandlers();
	return {
		className: 'test-class',
		containerRef: { current: null } as RefObject<HTMLDivElement | null>,
		comboboxId: TEST_COMBOBOX_ID,
		resolvedInputValue: 'test',
		isOpen: false,
		listboxId: 'test-listbox',
		filteredOptions: mockOptions,
		highlightedIndex: 0,
		selectedValue: '1',
		isLoading: false,
		loadingMessage: LOADING_MESSAGE,
		noOptionsMessage: NO_OPTIONS_MESSAGE,
		disabled: false,
		required: false,
		...handlers,
		...overrides,
	};
}

describe('filterOptions', () => {
	it('returns all options when search term is empty', () => {
		const result = filterOptions(mockOptions, '');
		expect(result).toEqual(mockOptions);
	});

	it('filters by label (case insensitive)', () => {
		const result = filterOptions(mockOptions, 'app');
		expect(result).toHaveLength(1);
		expect(result[0]?.label).toBe('Apple');
	});

	it('filters by value (case insensitive)', () => {
		const result = filterOptions(mockOptions, '1');
		expect(result).toHaveLength(1);
		expect(result[0]?.value).toBe('1');
	});

	it('filters by keywords', () => {
		const optionsWithKeywords: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', keywords: ['red', 'fruit'] },
			{ value: '2', label: 'Banana', keywords: ['yellow'] },
		];

		const result = filterOptions(optionsWithKeywords, 'red');
		expect(result).toHaveLength(1);
		expect(result[0]?.label).toBe('Apple');
	});

	it('filters by partial keyword match', () => {
		const optionsWithKeywords: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', keywords: ['red', 'fruit'] },
			{ value: '2', label: 'Banana', keywords: ['yellow', 'fruit'] },
		];

		const result = filterOptions(optionsWithKeywords, 'fru');
		expect(result).toHaveLength(2);
	});

	it('returns empty array when no matches', () => {
		const result = filterOptions(mockOptions, 'XYZ');
		expect(result).toHaveLength(0);
	});

	it('handles options without keywords', () => {
		const optionsWithoutKeywords: AutocompleteOption[] = [
			{ value: '1', label: 'Apple' },
			{ value: '2', label: 'Banana' },
		];

		const result = filterOptions(optionsWithoutKeywords, 'App');
		expect(result).toHaveLength(1);
	});

	it('filters multiple matches', () => {
		const result = filterOptions(mockOptions, 'a');
		expect(result.length).toBeGreaterThan(1);
		expect(result.some(opt => opt.label === 'Apple')).toBe(true);
		expect(result.some(opt => opt.label === 'Banana')).toBe(true);
	});
});

describe('findNextEnabledIndex', () => {
	it('returns -1 for empty options', () => {
		const result = findNextEnabledIndex([], 0, 1);
		expect(result).toBe(-1);
	});

	it('finds next enabled index forward', () => {
		const result = findNextEnabledIndex(mockOptions, 0, 1);
		expect(result).toBe(1); // Banana (skips Apple at 0, but finds next)
	});

	it('finds next enabled index backward', () => {
		const result = findNextEnabledIndex(mockOptions, 2, -1);
		expect(result).toBe(1); // Banana
	});

	it('skips disabled options', () => {
		const result = findNextEnabledIndex(mockOptions, 2, 1);
		expect(result).toBe(4); // Elderberry (skips disabled Date at index 3)
	});

	it('wraps around when going forward', () => {
		const result = findNextEnabledIndex(mockOptions, 4, 1);
		expect(result).toBe(0); // Wraps to Apple
	});

	it('wraps around when going backward', () => {
		const result = findNextEnabledIndex(mockOptions, 0, -1);
		expect(result).toBe(4); // Wraps to Elderberry
	});

	it('returns -1 when all options are disabled', () => {
		const allDisabled: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', disabled: true },
			{ value: '2', label: 'Banana', disabled: true },
		];

		const result = findNextEnabledIndex(allDisabled, 0, 1);
		expect(result).toBe(-1);
	});

	it('finds enabled option when starting from disabled', () => {
		const result = findNextEnabledIndex(mockOptions, 3, 1);
		expect(result).toBe(4); // Elderberry
	});
});

describe('getActiveDescendant', () => {
	it('returns undefined when highlightedIndex is negative', () => {
		const result = getActiveDescendant(COMBOBOX_ID, -1, mockOptions);
		expect(result).toBeUndefined();
	});

	it('returns undefined when highlightedIndex is out of bounds', () => {
		const result = getActiveDescendant(COMBOBOX_ID, 10, mockOptions);
		expect(result).toBeUndefined();
	});

	it('returns correct ID for valid highlighted index', () => {
		const result = getActiveDescendant(COMBOBOX_ID, 0, mockOptions);
		expect(result).toBe(`${COMBOBOX_ID}-option-1`);
	});

	it('returns correct ID for different combobox ID', () => {
		const result = getActiveDescendant(TEST_COMBOBOX_ID, 1, mockOptions);
		expect(result).toBe(`${TEST_COMBOBOX_ID}-option-2`);
	});

	it('returns correct ID for different option value', () => {
		const result = getActiveDescendant(COMBOBOX_ID, 2, mockOptions);
		expect(result).toBe(`${COMBOBOX_ID}-option-3`);
	});
});

describe('buildComboboxBodyProps', () => {
	it('transforms handler props correctly', () => {
		const handlers = createMockHandlers();
		const params = createBaseParams(handlers);

		const result = buildComboboxBodyProps(params);

		expect(result.onChange).toBe(handlers.handleChange);
		expect(result.onFocus).toBe(handlers.openList);
		expect(result.onKeyDown).toBe(handlers.handleKeyDown);
		expect(result.onSelect).toBe(handlers.selectOption);
		expect(result.className).toBe('test-class');
		expect(result.comboboxId).toBe(TEST_COMBOBOX_ID);
		expect(result.resolvedInputValue).toBe('test');
	});
});

describe('buildComboboxBodyProps - preserves basic props', () => {
	it('preserves basic styling and identification props', () => {
		const params = createBaseParams({
			className: 'custom-class',
			comboboxId: 'my-combobox',
			labelId: 'my-label',
			label: 'Test Label',
		});

		const result = buildComboboxBodyProps(params);

		expect(result.className).toBe('custom-class');
		expect(result.comboboxId).toBe('my-combobox');
		expect(result.labelId).toBe('my-label');
		expect(result.label).toBe('Test Label');
	});

	it('preserves input-related props', () => {
		const params = createBaseParams({
			resolvedInputValue: 'input value',
			placeholder: 'Placeholder',
		});

		const result = buildComboboxBodyProps(params);

		expect(result.resolvedInputValue).toBe('input value');
		expect(result.placeholder).toBe('Placeholder');
	});

	it('preserves helper text and error props', () => {
		const params = createBaseParams({
			helperText: 'Helper',
			helperId: 'helper-id',
			error: 'Error',
			errorId: 'error-id',
		});

		const result = buildComboboxBodyProps(params);

		expect(result.helperText).toBe('Helper');
		expect(result.helperId).toBe('helper-id');
		expect(result.error).toBe('Error');
		expect(result.errorId).toBe('error-id');
	});
});

describe('buildComboboxBodyProps - preserves state and control props', () => {
	it('preserves state and control props', () => {
		const params = createBaseParams({
			disabled: true,
			required: true,
			isOpen: true,
		});

		const result = buildComboboxBodyProps(params);

		expect(result.disabled).toBe(true);
		expect(result.required).toBe(true);
		expect(result.isOpen).toBe(true);
	});

	it('preserves listbox and accessibility props', () => {
		const params = createBaseParams({
			listboxId: 'listbox-id',
			activeDescendant: 'active-id',
			ownedIds: 'helper-id error-id',
		});

		const result = buildComboboxBodyProps(params);

		expect(result.listboxId).toBe('listbox-id');
		expect(result.activeDescendant).toBe('active-id');
		expect(result.ownedIds).toBe('helper-id error-id');
	});
});

describe('buildComboboxBodyProps - preserves data props', () => {
	it('preserves options and selection props', () => {
		const params = createBaseParams({
			filteredOptions: mockOptions,
			highlightedIndex: 1,
			selectedValue: '2',
		});

		const result = buildComboboxBodyProps(params);

		expect(result.filteredOptions).toEqual(mockOptions);
		expect(result.highlightedIndex).toBe(1);
		expect(result.selectedValue).toBe('2');
	});

	it('preserves loading and message props', () => {
		const params = createBaseParams({
			isLoading: true,
			loadingMessage: LOADING_MESSAGE,
			noOptionsMessage: NO_OPTIONS_MESSAGE,
		});

		const result = buildComboboxBodyProps(params);

		expect(result.isLoading).toBe(true);
		expect(result.loadingMessage).toBe(LOADING_MESSAGE);
		expect(result.noOptionsMessage).toBe(NO_OPTIONS_MESSAGE);
	});
});
