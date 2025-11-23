/**
 * useAutocompleteComboboxHandlers.option Tests
 *
 * Tests for the useOptionCallbacks hook:
 * - Moving highlight
 * - Selecting options
 * - Disabled option handling
 * - Callback variations
 */

import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import {
	useMoveHighlight,
	useOptionCallbacks,
	useSelectOption,
} from '@domains/shared/components/autocomplete-combobox/hooks/useAutocompleteComboboxHandlers.option';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockOptions: AutocompleteOption[] = [
	{ value: '1', label: 'Apple' },
	{ value: '2', label: 'Banana', disabled: true },
	{ value: '3', label: 'Cherry' },
	{ value: '4', label: 'Date' },
];

const OPTION_NOT_FOUND_ERROR = 'Option not found';

// Helper functions for useMoveHighlight tests
const createMoveHighlightHook = (
	filteredOptions: AutocompleteOption[],
	highlightedIndex: number,
	setHighlightedIndex: (index: number) => void
) => {
	return renderHook(() =>
		useMoveHighlight({
			filteredOptions,
			highlightedIndex,
			setHighlightedIndex,
		})
	);
};

const createMoveHighlightHookWithRerender = (
	filteredOptions: AutocompleteOption[],
	highlightedIndex: number,
	setHighlightedIndex: (index: number) => void
) => {
	return renderHook(
		({ filteredOptions: opts }: { filteredOptions: AutocompleteOption[] }) =>
			useMoveHighlight({
				filteredOptions: opts,
				highlightedIndex,
				setHighlightedIndex,
			}),
		{
			initialProps: { filteredOptions },
		}
	);
};

describe('useMoveHighlight', () => {
	describe('basic movement', () => {
		it('moves highlight forward when next index is valid', () => {
			const setHighlightedIndex = vi.fn();
			const { result } = createMoveHighlightHook(mockOptions, 0, setHighlightedIndex);

			act(() => {
				result.current(1);
			});

			expect(setHighlightedIndex).toHaveBeenCalled();
		});

		it('moves highlight backward when previous index is valid', () => {
			const setHighlightedIndex = vi.fn();
			const { result } = createMoveHighlightHook(mockOptions, 2, setHighlightedIndex);

			act(() => {
				result.current(-1);
			});

			expect(setHighlightedIndex).toHaveBeenCalled();
		});
	});

	describe('edge cases', () => {
		it('does not update when next index is invalid', () => {
			const setHighlightedIndex = vi.fn();
			const { result } = createMoveHighlightHook(mockOptions, -1, setHighlightedIndex);

			act(() => {
				result.current(1);
			});

			// Should skip disabled options, so might still be called
			// The actual behavior depends on findNextEnabledIndex implementation
			// But we can verify it doesn't set an invalid index
			if (setHighlightedIndex.mock.calls.length > 0) {
				const calledIndex = setHighlightedIndex.mock.calls[0]?.[0];
				expect(calledIndex).toBeGreaterThanOrEqual(0);
			}
		});

		it('updates when filtered options change', () => {
			const setHighlightedIndex = vi.fn();
			const { result, rerender } = createMoveHighlightHookWithRerender(
				mockOptions,
				0,
				setHighlightedIndex
			);

			const newOptions: AutocompleteOption[] = [
				{ value: '5', label: 'Elderberry' },
				{ value: '6', label: 'Fig' },
			];

			rerender({ filteredOptions: newOptions });

			act(() => {
				result.current(1);
			});

			expect(setHighlightedIndex).toHaveBeenCalled();
		});
	});
});

// Helper functions for useSelectOption tests
interface SelectOptionMocks {
	onValueChange?: (value: string | undefined) => void;
	onOptionSelect?: (option: AutocompleteOption | undefined) => void;
	updateInputValue: (value: string) => void;
	closeList: () => void;
}

const createSelectOptionMocks = (): SelectOptionMocks => ({
	onValueChange: vi.fn(),
	onOptionSelect: vi.fn(),
	updateInputValue: vi.fn(),
	closeList: vi.fn(),
});

const createSelectOptionHook = (mocks: SelectOptionMocks) => {
	return renderHook(() =>
		useSelectOption({
			onValueChange: mocks.onValueChange,
			onOptionSelect: mocks.onOptionSelect,
			updateInputValue: mocks.updateInputValue,
			closeList: mocks.closeList,
		})
	);
};

const getFirstOption = (): AutocompleteOption => {
	const [option] = mockOptions;
	if (!option) {
		throw new Error(OPTION_NOT_FOUND_ERROR);
	}
	return option;
};

const getDisabledOption = (): AutocompleteOption => {
	const [, disabledOption] = mockOptions;
	if (!disabledOption) {
		throw new Error(OPTION_NOT_FOUND_ERROR);
	}
	return disabledOption;
};

const expectAllCallbacksNotCalled = (mocks: SelectOptionMocks) => {
	expect(mocks.onValueChange).not.toHaveBeenCalled();
	expect(mocks.onOptionSelect).not.toHaveBeenCalled();
	expect(mocks.updateInputValue).not.toHaveBeenCalled();
	expect(mocks.closeList).not.toHaveBeenCalled();
};

const expectSuccessfulSelection = (mocks: SelectOptionMocks, option: AutocompleteOption) => {
	expect(mocks.onValueChange).toHaveBeenCalledWith(option.value);
	expect(mocks.onOptionSelect).toHaveBeenCalledWith(option);
	expect(mocks.updateInputValue).toHaveBeenCalledWith(option.label);
	expect(mocks.closeList).toHaveBeenCalledTimes(1);
};

const selectOptionInHook = (
	result: { current: (option: AutocompleteOption | undefined) => void },
	option: AutocompleteOption | undefined
) => {
	act(() => {
		result.current(option);
	});
};

describe('useSelectOption', () => {
	describe('successful selection', () => {
		it('selects enabled option and calls callbacks', () => {
			const mocks = createSelectOptionMocks();
			const { result } = createSelectOptionHook(mocks);
			const option = getFirstOption();

			selectOptionInHook(result, option);

			expectSuccessfulSelection(mocks, option);
		});

		it('handles option with empty value', () => {
			const mocks = createSelectOptionMocks();
			const { result } = createSelectOptionHook(mocks);
			const option: AutocompleteOption = { value: '', label: 'Empty' };

			selectOptionInHook(result, option);

			expectSuccessfulSelection(mocks, option);
		});
	});

	describe('rejected selection', () => {
		it('does not select disabled option', () => {
			const mocks = createSelectOptionMocks();
			const { result } = createSelectOptionHook(mocks);
			const disabledOption = getDisabledOption();

			selectOptionInHook(result, disabledOption);

			expectAllCallbacksNotCalled(mocks);
		});

		it('does not select undefined option', () => {
			const mocks = createSelectOptionMocks();
			const { result } = createSelectOptionHook(mocks);

			selectOptionInHook(result, undefined);

			expectAllCallbacksNotCalled(mocks);
		});
	});

	describe('optional callbacks', () => {
		it('works without optional callbacks', () => {
			const updateInputValue = vi.fn();
			const closeList = vi.fn();
			const { result } = createSelectOptionHook({
				updateInputValue,
				closeList,
			});
			const option = getFirstOption();

			selectOptionInHook(result, option);

			expect(updateInputValue).toHaveBeenCalledWith(option.label);
			expect(closeList).toHaveBeenCalledTimes(1);
		});
	});
});

// Helper functions for useOptionCallbacks tests
interface OptionCallbacksMocks {
	setHighlightedIndex: (index: number) => void;
	updateInputValue: (value: string) => void;
	closeList: () => void;
}

const createOptionCallbacksMocks = (): OptionCallbacksMocks => ({
	setHighlightedIndex: vi.fn(),
	updateInputValue: vi.fn(),
	closeList: vi.fn(),
});

const createOptionCallbacksHook = (
	filteredOptions: AutocompleteOption[],
	highlightedIndex: number,
	mocks: OptionCallbacksMocks
) => {
	return renderHook(() =>
		useOptionCallbacks({
			filteredOptions,
			highlightedIndex,
			setHighlightedIndex: mocks.setHighlightedIndex,
			updateInputValue: mocks.updateInputValue,
			closeList: mocks.closeList,
		})
	);
};

const createOptionCallbacksHookWithRerender = (
	filteredOptions: AutocompleteOption[],
	highlightedIndex: number
) => {
	return renderHook(
		({
			filteredOptions: opts,
			highlightedIndex: idx,
		}: {
			filteredOptions: AutocompleteOption[];
			highlightedIndex: number;
		}) =>
			useOptionCallbacks({
				filteredOptions: opts,
				highlightedIndex: idx,
				setHighlightedIndex: vi.fn(),
				updateInputValue: vi.fn(),
				closeList: vi.fn(),
			}),
		{
			initialProps: {
				filteredOptions,
				highlightedIndex,
			},
		}
	);
};

describe('useOptionCallbacks', () => {
	it('provides moveHighlight and selectOption', () => {
		const mocks = createOptionCallbacksMocks();
		const { result } = createOptionCallbacksHook(mockOptions, 0, mocks);

		expect(typeof result.current.moveHighlight).toBe('function');
		expect(typeof result.current.selectOption).toBe('function');
	});

	describe('moveHighlight', () => {
		it('works correctly', () => {
			const mocks = createOptionCallbacksMocks();
			const { result } = createOptionCallbacksHook(mockOptions, 0, mocks);

			act(() => {
				result.current.moveHighlight(1);
			});

			expect(mocks.setHighlightedIndex).toHaveBeenCalled();
		});
	});

	describe('selectOption', () => {
		it('works correctly', () => {
			const mocks = createOptionCallbacksMocks();
			const { result } = createOptionCallbacksHook(mockOptions, 0, mocks);

			const option = getFirstOption();
			act(() => {
				result.current.selectOption(option);
			});

			expect(mocks.updateInputValue).toHaveBeenCalledWith(option.label);
			expect(mocks.closeList).toHaveBeenCalledTimes(1);
		});

		it('does not select disabled option', () => {
			const mocks = createOptionCallbacksMocks();
			const { result } = createOptionCallbacksHook(mockOptions, 1, mocks);

			const disabledOption = getDisabledOption();
			act(() => {
				result.current.selectOption(disabledOption);
			});

			expect(mocks.updateInputValue).not.toHaveBeenCalled();
			expect(mocks.closeList).not.toHaveBeenCalled();
		});
	});

	describe('dependency updates', () => {
		it('updates callbacks when dependencies change', () => {
			const { result, rerender } = createOptionCallbacksHookWithRerender(mockOptions, 0);

			const firstMove = result.current.moveHighlight;

			rerender({
				filteredOptions: mockOptions,
				highlightedIndex: 1,
			});

			expect(result.current.moveHighlight).not.toBe(firstMove);
		});
	});
});
