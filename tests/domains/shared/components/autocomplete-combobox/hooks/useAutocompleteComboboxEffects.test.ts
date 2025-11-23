/**
 * useAutocompleteComboboxEffects Tests
 *
 * Tests for the useAutocompleteComboboxEffects hook:
 * - Click outside detection
 * - Highlight reset on filtered options change
 * - Effect dependencies
 */

import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import {
	useComboboxContainer,
	useComboboxEffects,
} from '@domains/shared/components/autocomplete-combobox/hooks/useAutocompleteComboboxEffects';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockOptions: AutocompleteOption[] = [
	{ value: '1', label: 'Apple' },
	{ value: '2', label: 'Banana' },
	{ value: '3', label: 'Cherry', disabled: true },
	{ value: '4', label: 'Date' },
];

// Helper function to create and dispatch a mousedown event
const createMouseDownEvent = (target: HTMLElement): MouseEvent => {
	const event = new MouseEvent('mousedown', {
		bubbles: true,
		cancelable: true,
	});
	Object.defineProperty(event, 'target', {
		writable: false,
		value: target,
	});
	return event;
};

// Helper function to wait for a short delay
const waitForDelay = (ms = 10): Promise<void> => {
	return new Promise<void>(resolve => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
};

describe('useComboboxContainer', () => {
	it('returns container ref', () => {
		const { result } = renderHook(() =>
			useComboboxContainer({
				isOpen: false,
				onClose: vi.fn(),
			})
		);

		expect(result.current.containerRef).toBeDefined();
		expect(result.current.containerRef.current).toBeNull();
	});
});

describe('useComboboxContainer - click outside detection', () => {
	it('closes when clicking outside container', async () => {
		const onClose = vi.fn();
		const { result } = renderHook(() =>
			useComboboxContainer({
				isOpen: true,
				onClose,
			})
		);

		const container = document.createElement('div');
		act(() => {
			result.current.containerRef.current = container;
		});

		const outsideElement = document.createElement('div');
		document.body.append(outsideElement);

		await act(async () => {
			const event = createMouseDownEvent(outsideElement);
			document.dispatchEvent(event);
		});

		await waitFor(() => {
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		outsideElement.remove();
	});

	it('does not close when clicking inside container', async () => {
		const onClose = vi.fn();
		const { result } = renderHook(() =>
			useComboboxContainer({
				isOpen: true,
				onClose,
			})
		);

		const container = document.createElement('div');
		const insideElement = document.createElement('div');
		container.append(insideElement);
		act(() => {
			result.current.containerRef.current = container;
		});

		await act(async () => {
			const event = createMouseDownEvent(insideElement);
			document.dispatchEvent(event);
		});

		await waitForDelay();

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('useComboboxContainer - listener attachment', () => {
	it('does not attach listener when closed', async () => {
		const onClose = vi.fn();
		renderHook(() =>
			useComboboxContainer({
				isOpen: false,
				onClose,
			})
		);

		await act(async () => {
			const event = new MouseEvent('mousedown', {
				bubbles: true,
				cancelable: true,
			});
			document.dispatchEvent(event);
		});

		await waitForDelay();

		expect(onClose).not.toHaveBeenCalled();
	});

	it('cleans up event listener on unmount', () => {
		const onClose = vi.fn();
		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

		const { unmount } = renderHook(() =>
			useComboboxContainer({
				isOpen: true,
				onClose,
			})
		);

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
		removeEventListenerSpy.mockRestore();
	});
});

describe('useComboboxContainer - listener updates', () => {
	it('updates listener when isOpen changes', async () => {
		const onClose = vi.fn();
		const { result, rerender } = renderHook(
			({ isOpen }: { isOpen: boolean }) =>
				useComboboxContainer({
					isOpen,
					onClose,
				}),
			{
				initialProps: { isOpen: false },
			}
		);

		const container = document.createElement('div');
		act(() => {
			result.current.containerRef.current = container;
		});

		rerender({ isOpen: true });

		const outsideElement = document.createElement('div');
		document.body.append(outsideElement);

		await act(async () => {
			const event = createMouseDownEvent(outsideElement);
			document.dispatchEvent(event);
		});

		await waitFor(() => {
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		outsideElement.remove();
	});
});

// Helper function to create render hook for useComboboxEffects
interface EffectsProps {
	filteredOptions: AutocompleteOption[];
	isOpen: boolean;
	firstEnabledIndex?: number;
}

const createEffectsHook = (props: EffectsProps, setHighlightedIndex: (index: number) => void) => {
	return renderHook(
		({
			filteredOptions,
			isOpen,
			firstEnabledIndex,
		}: {
			filteredOptions: AutocompleteOption[];
			isOpen: boolean;
			firstEnabledIndex: number;
		}) =>
			useComboboxEffects({
				filteredOptions,
				isOpen,
				firstEnabledIndex: firstEnabledIndex ?? 0,
				setHighlightedIndex,
			}),
		{
			initialProps: {
				filteredOptions: props.filteredOptions,
				isOpen: props.isOpen,
				firstEnabledIndex: props.firstEnabledIndex ?? 0,
			},
		}
	);
};

describe('useComboboxEffects - highlight reset when open', () => {
	it('resets highlight when filtered options change', async () => {
		const setHighlightedIndex = vi.fn();
		const { rerender } = createEffectsHook(
			{
				filteredOptions: mockOptions,
				isOpen: true,
				firstEnabledIndex: 0,
			},
			setHighlightedIndex
		);

		const newOptions: AutocompleteOption[] = [{ value: '5', label: 'Elderberry' }];
		rerender({
			filteredOptions: newOptions,
			isOpen: true,
			firstEnabledIndex: 0,
		});

		await waitFor(() => {
			expect(setHighlightedIndex).toHaveBeenCalledWith(0);
		});
	});

	it('resets highlight to -1 when no enabled options', async () => {
		const setHighlightedIndex = vi.fn();
		const { rerender } = createEffectsHook(
			{
				filteredOptions: mockOptions,
				isOpen: true,
				firstEnabledIndex: -1,
			},
			setHighlightedIndex
		);

		const allDisabled: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', disabled: true },
			{ value: '2', label: 'Banana', disabled: true },
		];
		rerender({
			filteredOptions: allDisabled,
			isOpen: true,
			firstEnabledIndex: -1,
		});

		await waitFor(() => {
			expect(setHighlightedIndex).toHaveBeenCalledWith(-1);
		});
	});
});

describe('useComboboxEffects - highlight reset when closed', () => {
	it('does not reset highlight when filtered options change', async () => {
		const setHighlightedIndex = vi.fn();
		const { rerender } = createEffectsHook(
			{
				filteredOptions: mockOptions,
				isOpen: false,
				firstEnabledIndex: 0,
			},
			setHighlightedIndex
		);

		const newOptions: AutocompleteOption[] = [{ value: '5', label: 'Elderberry' }];
		rerender({
			filteredOptions: newOptions,
			isOpen: false,
			firstEnabledIndex: 0,
		});

		await waitForDelay();

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});
});

describe('useComboboxEffects - highlight update scenarios', () => {
	it('does not reset highlight when filtered options reference is unchanged', async () => {
		const setHighlightedIndex = vi.fn();
		createEffectsHook(
			{
				filteredOptions: mockOptions,
				isOpen: true,
				firstEnabledIndex: 0,
			},
			setHighlightedIndex
		);

		await waitForDelay();

		expect(setHighlightedIndex).not.toHaveBeenCalled();
	});

	it('updates highlight when firstEnabledIndex changes', async () => {
		const setHighlightedIndex = vi.fn();
		const { rerender } = createEffectsHook(
			{
				filteredOptions: mockOptions,
				isOpen: true,
				firstEnabledIndex: 0,
			},
			setHighlightedIndex
		);

		const newOptions: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', disabled: true },
			{ value: '2', label: 'Banana' },
		];
		rerender({
			filteredOptions: newOptions,
			isOpen: true,
			firstEnabledIndex: 1,
		});

		await waitFor(() => {
			expect(setHighlightedIndex).toHaveBeenCalledWith(1);
		});
	});
});
