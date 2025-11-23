/**
 * useAutocompleteKeyboard.actions Tests
 *
 * Tests for the useActionHandlers hook:
 * - Enter/Space key selection behavior
 * - Escape key behavior
 * - Edge cases and validation
 */

import type { AutocompleteOption } from '@core/ui/forms/autocomplete/Autocomplete';
import {
	useActionHandlers,
	type UseActionHandlersParams,
} from '@core/ui/forms/autocomplete/helpers/useAutocompleteKeyboard.actions';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockOptions: AutocompleteOption[] = [
	{ value: '1', label: 'Apple' },
	{ value: '2', label: 'Banana' },
	{ value: '3', label: 'Cherry' },
];

type HandlerParams = UseActionHandlersParams;

const createDefaultParams = (overrides?: Partial<HandlerParams>): HandlerParams => ({
	isOpen: false,
	filteredOptions: mockOptions,
	highlightedIndex: -1,
	handleSelect: vi.fn(),
	setIsOpen: vi.fn(),
	setHighlightedIndex: vi.fn(),
	...overrides,
});

describe('useActionHandlers', () => {
	describe('handleEnterOrSpace', () => {
		describe('selection behavior', () => {
			it('should select highlighted option when autocomplete is open and has valid index', () => {
				const handleSelect = vi.fn();
				const { result } = renderHook(() =>
					useActionHandlers(
						createDefaultParams({
							isOpen: true,
							highlightedIndex: 1,
							handleSelect,
						})
					)
				);

				act(() => {
					result.current.handleEnterOrSpace();
				});

				expect(handleSelect).toHaveBeenCalledTimes(1);
				expect(handleSelect).toHaveBeenCalledWith(mockOptions[1]);
			});

			it('should select first option when highlighted index is 0', () => {
				const handleSelect = vi.fn();
				const { result } = renderHook(() =>
					useActionHandlers(
						createDefaultParams({
							isOpen: true,
							highlightedIndex: 0,
							handleSelect,
						})
					)
				);

				act(() => {
					result.current.handleEnterOrSpace();
				});

				expect(handleSelect).toHaveBeenCalledWith(mockOptions[0]);
			});

			it('should select last option when highlighted index is at the end', () => {
				const handleSelect = vi.fn();
				const lastIndex = mockOptions.length - 1;
				const { result } = renderHook(() =>
					useActionHandlers(
						createDefaultParams({
							isOpen: true,
							highlightedIndex: lastIndex,
							handleSelect,
						})
					)
				);

				act(() => {
					result.current.handleEnterOrSpace();
				});

				expect(handleSelect).toHaveBeenCalledWith(mockOptions[lastIndex]);
			});
		});

		describe('edge cases', () => {
			it('should not select when autocomplete is closed', () => {
				const handleSelect = vi.fn();
				const { result } = renderHook(() =>
					useActionHandlers(
						createDefaultParams({
							isOpen: false,
							highlightedIndex: 1,
							handleSelect,
						})
					)
				);

				act(() => {
					result.current.handleEnterOrSpace();
				});

				expect(handleSelect).not.toHaveBeenCalled();
			});

			it('should not select when highlighted index is negative', () => {
				const handleSelect = vi.fn();
				const { result } = renderHook(() =>
					useActionHandlers(
						createDefaultParams({
							isOpen: true,
							highlightedIndex: -1,
							handleSelect,
						})
					)
				);

				act(() => {
					result.current.handleEnterOrSpace();
				});

				expect(handleSelect).not.toHaveBeenCalled();
			});

			it('should not select when highlighted index is out of bounds', () => {
				const handleSelect = vi.fn();
				const { result } = renderHook(() =>
					useActionHandlers(
						createDefaultParams({
							isOpen: true,
							highlightedIndex: mockOptions.length,
							handleSelect,
						})
					)
				);

				act(() => {
					result.current.handleEnterOrSpace();
				});

				expect(handleSelect).not.toHaveBeenCalled();
			});

			it('should not select when filtered options array is empty', () => {
				const handleSelect = vi.fn();
				const { result } = renderHook(() =>
					useActionHandlers(
						createDefaultParams({
							isOpen: true,
							highlightedIndex: 0,
							filteredOptions: [],
							handleSelect,
						})
					)
				);

				act(() => {
					result.current.handleEnterOrSpace();
				});

				expect(handleSelect).not.toHaveBeenCalled();
			});

			it('should not select when option at highlighted index is undefined', () => {
				const handleSelect = vi.fn();
				// Create an array with an actual undefined at index 1
				const sparseOptions: (AutocompleteOption | undefined)[] = [
					mockOptions[0],
					undefined,
					mockOptions[2],
				];

				const { result } = renderHook(() =>
					useActionHandlers(
						createDefaultParams({
							isOpen: true,
							highlightedIndex: 1,
							filteredOptions: sparseOptions as AutocompleteOption[],
							handleSelect,
						})
					)
				);

				act(() => {
					result.current.handleEnterOrSpace();
				});

				// The implementation checks !filteredOptions[highlightedIndex], which should catch undefined
				expect(handleSelect).not.toHaveBeenCalled();
			});
		});

		describe('callback dependencies', () => {
			it('should use updated highlighted index when it changes', () => {
				const handleSelect = vi.fn();
				const { result, rerender } = renderHook(
					({ highlightedIndex }: { highlightedIndex: number }) =>
						useActionHandlers(
							createDefaultParams({
								isOpen: true,
								highlightedIndex,
								handleSelect,
							})
						),
					{
						initialProps: { highlightedIndex: 0 },
					}
				);

				act(() => {
					result.current.handleEnterOrSpace();
				});

				expect(handleSelect).toHaveBeenCalledWith(mockOptions[0]);

				rerender({ highlightedIndex: 2 });

				act(() => {
					result.current.handleEnterOrSpace();
				});

				expect(handleSelect).toHaveBeenCalledTimes(2);
				expect(handleSelect).toHaveBeenLastCalledWith(mockOptions[2]);
			});

			it('should use updated filtered options when they change', () => {
				const handleSelect = vi.fn();
				const newOptions: AutocompleteOption[] = [
					{ value: '4', label: 'Date' },
					{ value: '5', label: 'Elderberry' },
				];

				const { result, rerender } = renderHook(
					({ filteredOptions }: { filteredOptions: AutocompleteOption[] }) =>
						useActionHandlers(
							createDefaultParams({
								isOpen: true,
								highlightedIndex: 0,
								filteredOptions,
								handleSelect,
							})
						),
					{
						initialProps: { filteredOptions: mockOptions },
					}
				);

				act(() => {
					result.current.handleEnterOrSpace();
				});

				expect(handleSelect).toHaveBeenCalledWith(mockOptions[0]);

				rerender({ filteredOptions: newOptions });

				act(() => {
					result.current.handleEnterOrSpace();
				});

				expect(handleSelect).toHaveBeenCalledTimes(2);
				expect(handleSelect).toHaveBeenLastCalledWith(newOptions[0]);
			});
		});
	});

	describe('handleEscape', () => {
		describe('closing behavior', () => {
			it('should close autocomplete and reset highlighted index', () => {
				const setIsOpen = vi.fn();
				const setHighlightedIndex = vi.fn();
				const { result } = renderHook(() =>
					useActionHandlers(
						createDefaultParams({
							isOpen: true,
							highlightedIndex: 1,
							setIsOpen,
							setHighlightedIndex,
						})
					)
				);

				act(() => {
					result.current.handleEscape();
				});

				expect(setIsOpen).toHaveBeenCalledTimes(1);
				expect(setIsOpen).toHaveBeenCalledWith(false);
				expect(setHighlightedIndex).toHaveBeenCalledTimes(1);
				expect(setHighlightedIndex).toHaveBeenCalledWith(-1);
			});

			it('should close autocomplete even when already closed', () => {
				const setIsOpen = vi.fn();
				const setHighlightedIndex = vi.fn();
				const { result } = renderHook(() =>
					useActionHandlers(
						createDefaultParams({
							isOpen: false,
							highlightedIndex: -1,
							setIsOpen,
							setHighlightedIndex,
						})
					)
				);

				act(() => {
					result.current.handleEscape();
				});

				expect(setIsOpen).toHaveBeenCalledWith(false);
				expect(setHighlightedIndex).toHaveBeenCalledWith(-1);
			});

			it('should reset highlighted index even when it is already -1', () => {
				const setIsOpen = vi.fn();
				const setHighlightedIndex = vi.fn();
				const { result } = renderHook(() =>
					useActionHandlers(
						createDefaultParams({
							isOpen: true,
							highlightedIndex: -1,
							setIsOpen,
							setHighlightedIndex,
						})
					)
				);

				act(() => {
					result.current.handleEscape();
				});

				expect(setHighlightedIndex).toHaveBeenCalledWith(-1);
			});
		});

		describe('callback dependencies', () => {
			it('should use updated callbacks when they change', () => {
				const setIsOpen1 = vi.fn();
				const setHighlightedIndex1 = vi.fn();
				const setIsOpen2 = vi.fn();
				const setHighlightedIndex2 = vi.fn();

				const { result, rerender } = renderHook(
					({
						setIsOpen,
						setHighlightedIndex,
					}: {
						setIsOpen: (open: boolean) => void;
						setHighlightedIndex: (index: number) => void;
					}) =>
						useActionHandlers(
							createDefaultParams({
								isOpen: true,
								highlightedIndex: 1,
								setIsOpen,
								setHighlightedIndex,
							})
						),
					{
						initialProps: {
							setIsOpen: setIsOpen1,
							setHighlightedIndex: setHighlightedIndex1,
						},
					}
				);

				act(() => {
					result.current.handleEscape();
				});

				expect(setIsOpen1).toHaveBeenCalledWith(false);
				expect(setHighlightedIndex1).toHaveBeenCalledWith(-1);

				rerender({
					setIsOpen: setIsOpen2,
					setHighlightedIndex: setHighlightedIndex2,
				});

				act(() => {
					result.current.handleEscape();
				});

				expect(setIsOpen2).toHaveBeenCalledWith(false);
				expect(setHighlightedIndex2).toHaveBeenCalledWith(-1);
			});
		});
	});

	describe('handler memoization', () => {
		it('should maintain stable handler references when params unchanged', () => {
			const params = createDefaultParams({ isOpen: true, highlightedIndex: 1 });
			const { result, rerender } = renderHook(() => useActionHandlers(params));

			const firstHandleEnterOrSpace = result.current.handleEnterOrSpace;
			const firstHandleEscape = result.current.handleEscape;

			rerender();

			expect(result.current.handleEnterOrSpace).toBe(firstHandleEnterOrSpace);
			expect(result.current.handleEscape).toBe(firstHandleEscape);
		});

		it('should create new handlers when dependencies change', () => {
			const baseParams = createDefaultParams({ highlightedIndex: 1 });
			const { result, rerender } = renderHook(
				({ isOpen }: { isOpen: boolean }) =>
					useActionHandlers({
						...baseParams,
						isOpen,
					}),
				{
					initialProps: { isOpen: true },
				}
			);

			const firstHandleEnterOrSpace = result.current.handleEnterOrSpace;
			const firstHandleEscape = result.current.handleEscape;

			rerender({ isOpen: false });

			expect(result.current.handleEnterOrSpace).not.toBe(firstHandleEnterOrSpace);
			expect(result.current.handleEscape).toBe(firstHandleEscape); // handleEscape doesn't depend on isOpen
		});

		it('should create new handleEnterOrSpace when highlightedIndex changes', () => {
			const baseParams = createDefaultParams({ isOpen: true });
			const { result, rerender } = renderHook(
				({ highlightedIndex }: { highlightedIndex: number }) =>
					useActionHandlers({
						...baseParams,
						highlightedIndex,
					}),
				{
					initialProps: { highlightedIndex: 0 },
				}
			);

			const firstHandleEnterOrSpace = result.current.handleEnterOrSpace;

			rerender({ highlightedIndex: 1 });

			expect(result.current.handleEnterOrSpace).not.toBe(firstHandleEnterOrSpace);
		});

		it('should create new handleEnterOrSpace when filteredOptions change', () => {
			const baseParams = createDefaultParams({ isOpen: true, highlightedIndex: 0 });
			const { result, rerender } = renderHook(
				({ filteredOptions }: { filteredOptions: AutocompleteOption[] }) =>
					useActionHandlers({
						...baseParams,
						filteredOptions,
					}),
				{
					initialProps: { filteredOptions: mockOptions },
				}
			);

			const firstHandleEnterOrSpace = result.current.handleEnterOrSpace;

			rerender({ filteredOptions: [{ value: 'new', label: 'New Option' }] });

			expect(result.current.handleEnterOrSpace).not.toBe(firstHandleEnterOrSpace);
		});
	});
});
