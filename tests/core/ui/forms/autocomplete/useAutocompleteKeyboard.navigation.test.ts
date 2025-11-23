/**
 * Tests for useAutocompleteKeyboard.navigation hooks
 *
 * Tests the navigation hooks:
 * - useArrowHandlers: Arrow up/down navigation
 * - useHomeEndHandlers: Home/End navigation
 * - useNavigationHandlers: Combined navigation handlers
 */

import type { AutocompleteOption } from '@core/ui/forms/autocomplete/Autocomplete';
import {
	useArrowHandlers,
	useHomeEndHandlers,
	useNavigationHandlers,
} from '@core/ui/forms/autocomplete/helpers/useAutocompleteKeyboard.navigation';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useArrowHandlers', () => {
	const mockSetIsOpen = vi.fn();
	const mockSetHighlightedIndex = vi.fn();

	const defaultOptions: AutocompleteOption[] = [
		{ value: '1', label: 'Option 1' },
		{ value: '2', label: 'Option 2' },
		{ value: '3', label: 'Option 3' },
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('handleArrowDown', () => {
		it('opens dropdown when closed', () => {
			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: false,
					setIsOpen: mockSetIsOpen,
					filteredOptions: defaultOptions,
					highlightedIndex: -1,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowDown();
			});

			expect(mockSetIsOpen).toHaveBeenCalledWith(true);
			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});

		it('moves to next enabled option when open', () => {
			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: true,
					setIsOpen: mockSetIsOpen,
					filteredOptions: defaultOptions,
					highlightedIndex: 0,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowDown();
			});

			expect(mockSetIsOpen).not.toHaveBeenCalled();
			expect(mockSetHighlightedIndex).toHaveBeenCalledWith(1);
		});

		it('wraps to first option when at last option', () => {
			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: true,
					setIsOpen: mockSetIsOpen,
					filteredOptions: defaultOptions,
					highlightedIndex: 2,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowDown();
			});

			expect(mockSetHighlightedIndex).toHaveBeenCalledWith(0);
		});

		it('skips disabled options when moving down', () => {
			const optionsWithDisabled: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3' },
			];

			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: true,
					setIsOpen: mockSetIsOpen,
					filteredOptions: optionsWithDisabled,
					highlightedIndex: 0,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowDown();
			});

			expect(mockSetHighlightedIndex).toHaveBeenCalledWith(2);
		});

		it('does not update index when all options are disabled', () => {
			const allDisabledOptions: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1', disabled: true },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3', disabled: true },
			];

			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: true,
					setIsOpen: mockSetIsOpen,
					filteredOptions: allDisabledOptions,
					highlightedIndex: 0,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowDown();
			});

			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});

		it('handles empty options array', () => {
			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: true,
					setIsOpen: mockSetIsOpen,
					filteredOptions: [],
					highlightedIndex: -1,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowDown();
			});

			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});

		it('moves from -1 to first enabled option when open', () => {
			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: true,
					setIsOpen: mockSetIsOpen,
					filteredOptions: defaultOptions,
					highlightedIndex: -1,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowDown();
			});

			expect(mockSetHighlightedIndex).toHaveBeenCalledWith(0);
		});
	});

	describe('handleArrowUp', () => {
		it('does nothing when dropdown is closed', () => {
			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: false,
					setIsOpen: mockSetIsOpen,
					filteredOptions: defaultOptions,
					highlightedIndex: 1,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowUp();
			});

			expect(mockSetIsOpen).not.toHaveBeenCalled();
			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});

		it('moves to previous enabled option when open', () => {
			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: true,
					setIsOpen: mockSetIsOpen,
					filteredOptions: defaultOptions,
					highlightedIndex: 1,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowUp();
			});

			expect(mockSetHighlightedIndex).toHaveBeenCalledWith(0);
		});

		it('wraps to last option when at first option', () => {
			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: true,
					setIsOpen: mockSetIsOpen,
					filteredOptions: defaultOptions,
					highlightedIndex: 0,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowUp();
			});

			expect(mockSetHighlightedIndex).toHaveBeenCalledWith(2);
		});

		it('skips disabled options when moving up', () => {
			const optionsWithDisabled: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3' },
			];

			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: true,
					setIsOpen: mockSetIsOpen,
					filteredOptions: optionsWithDisabled,
					highlightedIndex: 2,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowUp();
			});

			expect(mockSetHighlightedIndex).toHaveBeenCalledWith(0);
		});

		it('does not update index when all options are disabled', () => {
			const allDisabledOptions: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1', disabled: true },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3', disabled: true },
			];

			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: true,
					setIsOpen: mockSetIsOpen,
					filteredOptions: allDisabledOptions,
					highlightedIndex: 1,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowUp();
			});

			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});

		it('handles empty options array', () => {
			const { result } = renderHook(() =>
				useArrowHandlers({
					isOpen: true,
					setIsOpen: mockSetIsOpen,
					filteredOptions: [],
					highlightedIndex: -1,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleArrowUp();
			});

			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});
	});
});

describe('useHomeEndHandlers', () => {
	const mockSetHighlightedIndex = vi.fn();

	const defaultOptions: AutocompleteOption[] = [
		{ value: '1', label: 'Option 1' },
		{ value: '2', label: 'Option 2' },
		{ value: '3', label: 'Option 3' },
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('handleHome', () => {
		it('does nothing when dropdown is closed', () => {
			const { result } = renderHook(() =>
				useHomeEndHandlers({
					isOpen: false,
					filteredOptions: defaultOptions,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleHome();
			});

			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});

		it('moves to first enabled option when open', () => {
			const { result } = renderHook(() =>
				useHomeEndHandlers({
					isOpen: true,
					filteredOptions: defaultOptions,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleHome();
			});

			expect(mockSetHighlightedIndex).toHaveBeenCalledWith(0);
		});

		it('skips disabled options at the start', () => {
			const optionsWithDisabled: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1', disabled: true },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3' },
			];

			const { result } = renderHook(() =>
				useHomeEndHandlers({
					isOpen: true,
					filteredOptions: optionsWithDisabled,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleHome();
			});

			expect(mockSetHighlightedIndex).toHaveBeenCalledWith(2);
		});

		it('does not update index when all options are disabled', () => {
			const allDisabledOptions: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1', disabled: true },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3', disabled: true },
			];

			const { result } = renderHook(() =>
				useHomeEndHandlers({
					isOpen: true,
					filteredOptions: allDisabledOptions,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleHome();
			});

			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});

		it('handles empty options array', () => {
			const { result } = renderHook(() =>
				useHomeEndHandlers({
					isOpen: true,
					filteredOptions: [],
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleHome();
			});

			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});
	});

	describe('handleEnd', () => {
		it('does nothing when dropdown is closed', () => {
			const { result } = renderHook(() =>
				useHomeEndHandlers({
					isOpen: false,
					filteredOptions: defaultOptions,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleEnd();
			});

			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});

		it('moves to last enabled option when open', () => {
			const { result } = renderHook(() =>
				useHomeEndHandlers({
					isOpen: true,
					filteredOptions: defaultOptions,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleEnd();
			});

			expect(mockSetHighlightedIndex).toHaveBeenCalledWith(2);
		});

		it('skips disabled options at the end', () => {
			const optionsWithDisabled: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3', disabled: true },
			];

			const { result } = renderHook(() =>
				useHomeEndHandlers({
					isOpen: true,
					filteredOptions: optionsWithDisabled,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleEnd();
			});

			expect(mockSetHighlightedIndex).toHaveBeenCalledWith(0);
		});

		it('does not update index when all options are disabled', () => {
			const allDisabledOptions: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1', disabled: true },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3', disabled: true },
			];

			const { result } = renderHook(() =>
				useHomeEndHandlers({
					isOpen: true,
					filteredOptions: allDisabledOptions,
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleEnd();
			});

			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});

		it('handles empty options array', () => {
			const { result } = renderHook(() =>
				useHomeEndHandlers({
					isOpen: true,
					filteredOptions: [],
					setHighlightedIndex: mockSetHighlightedIndex,
				})
			);

			act(() => {
				result.current.handleEnd();
			});

			expect(mockSetHighlightedIndex).not.toHaveBeenCalled();
		});
	});
});

describe('useNavigationHandlers', () => {
	const mockSetIsOpen = vi.fn();
	const mockSetHighlightedIndex = vi.fn();

	const defaultOptions: AutocompleteOption[] = [
		{ value: '1', label: 'Option 1' },
		{ value: '2', label: 'Option 2' },
		{ value: '3', label: 'Option 3' },
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns all navigation handlers', () => {
		const { result } = renderHook(() =>
			useNavigationHandlers({
				isOpen: true,
				setIsOpen: mockSetIsOpen,
				filteredOptions: defaultOptions,
				highlightedIndex: 1,
				setHighlightedIndex: mockSetHighlightedIndex,
			})
		);

		expect(result.current.handleArrowDown).toBeDefined();
		expect(result.current.handleArrowUp).toBeDefined();
		expect(result.current.handleHome).toBeDefined();
		expect(result.current.handleEnd).toBeDefined();
		expect(typeof result.current.handleArrowDown).toBe('function');
		expect(typeof result.current.handleArrowUp).toBe('function');
		expect(typeof result.current.handleHome).toBe('function');
		expect(typeof result.current.handleEnd).toBe('function');
	});

	it('arrow handlers work correctly', () => {
		const { result } = renderHook(() =>
			useNavigationHandlers({
				isOpen: true,
				setIsOpen: mockSetIsOpen,
				filteredOptions: defaultOptions,
				highlightedIndex: 1,
				setHighlightedIndex: mockSetHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleArrowDown();
		});

		expect(mockSetHighlightedIndex).toHaveBeenCalledWith(2);

		act(() => {
			result.current.handleArrowUp();
		});

		expect(mockSetHighlightedIndex).toHaveBeenCalledWith(0);
	});

	it('home/end handlers work correctly', () => {
		const { result } = renderHook(() =>
			useNavigationHandlers({
				isOpen: true,
				setIsOpen: mockSetIsOpen,
				filteredOptions: defaultOptions,
				highlightedIndex: 1,
				setHighlightedIndex: mockSetHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleHome();
		});

		expect(mockSetHighlightedIndex).toHaveBeenCalledWith(0);

		act(() => {
			result.current.handleEnd();
		});

		expect(mockSetHighlightedIndex).toHaveBeenCalledWith(2);
	});

	it('opens dropdown on arrow down when closed', () => {
		const { result } = renderHook(() =>
			useNavigationHandlers({
				isOpen: false,
				setIsOpen: mockSetIsOpen,
				filteredOptions: defaultOptions,
				highlightedIndex: -1,
				setHighlightedIndex: mockSetHighlightedIndex,
			})
		);

		act(() => {
			result.current.handleArrowDown();
		});

		expect(mockSetIsOpen).toHaveBeenCalledWith(true);
	});
});
