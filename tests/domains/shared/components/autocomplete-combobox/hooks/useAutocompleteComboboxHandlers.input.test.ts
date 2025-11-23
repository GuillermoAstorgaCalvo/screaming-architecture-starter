/**
 * useAutocompleteComboboxHandlers.input Tests
 *
 * Tests for the useInputCallbacks hook:
 * - Controlled vs uncontrolled input
 * - Input value updates
 * - List opening on input change
 * - Callback variations
 */

import { useInputCallbacks } from '@domains/shared/components/autocomplete-combobox/hooks/useAutocompleteComboboxHandlers.input';
import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Helper functions for test setup
function createChangeEvent(value: string): ChangeEvent<HTMLInputElement> {
	const input = document.createElement('input');
	input.value = value;
	return {
		target: input,
	} as ChangeEvent<HTMLInputElement>;
}

type MockSetInternalInputValue = ReturnType<typeof vi.fn<(value: string) => void>>;
type MockOnInputValueChange = ReturnType<typeof vi.fn<(value: string) => void>>;
type MockOpenList = ReturnType<typeof vi.fn<() => void>>;

interface RenderHookProps {
	isInputControlled?: boolean;
	isOpen?: boolean;
	setInternalInputValue?: MockSetInternalInputValue;
	onInputValueChange?: MockOnInputValueChange;
	openList?: MockOpenList;
}

function createDefaultMocks() {
	return {
		setInternalInputValue: vi.fn<(value: string) => void>(),
		openList: vi.fn<() => void>(),
	};
}

function renderHookWithProps(props: RenderHookProps) {
	const defaults = createDefaultMocks();
	return renderHook(() =>
		useInputCallbacks({
			isInputControlled: props.isInputControlled ?? false,
			isOpen: props.isOpen ?? false,
			setInternalInputValue: props.setInternalInputValue ?? defaults.setInternalInputValue,
			onInputValueChange: props.onInputValueChange,
			openList: props.openList ?? defaults.openList,
		})
	);
}

// Test suites
describe('useInputCallbacks - updateInputValue', () => {
	it('updates internal value when uncontrolled', () => {
		const setInternalInputValue = vi.fn();
		const { result } = renderHookWithProps({
			isInputControlled: false,
			setInternalInputValue,
		});

		act(() => {
			result.current.updateInputValue('test');
		});

		expect(setInternalInputValue).toHaveBeenCalledWith('test');
	});

	it('does not update internal value when controlled', () => {
		const setInternalInputValue = vi.fn();
		const { result } = renderHookWithProps({
			isInputControlled: true,
			setInternalInputValue,
		});

		act(() => {
			result.current.updateInputValue('test');
		});

		expect(setInternalInputValue).not.toHaveBeenCalled();
	});

	it('calls onInputValueChange when provided', () => {
		const onInputValueChange = vi.fn();
		const { result } = renderHookWithProps({
			onInputValueChange,
		});

		act(() => {
			result.current.updateInputValue('test');
		});

		expect(onInputValueChange).toHaveBeenCalledWith('test');
	});

	it('does not call onInputValueChange when not provided', () => {
		const { result } = renderHookWithProps({});

		act(() => {
			result.current.updateInputValue('test');
		});

		// Should not throw
		expect(result.current.updateInputValue).toBeDefined();
	});
});

describe('useInputCallbacks - handleChange - value updates', () => {
	it('updates input value on change', () => {
		const setInternalInputValue = vi.fn();
		const { result } = renderHookWithProps({
			setInternalInputValue,
		});

		const event = createChangeEvent('new value');

		act(() => {
			result.current.handleChange(event);
		});

		expect(setInternalInputValue).toHaveBeenCalledWith('new value');
	});

	it('handles empty string input', () => {
		const setInternalInputValue = vi.fn();
		const openList = vi.fn();
		const { result } = renderHookWithProps({
			setInternalInputValue,
			openList,
		});

		const event = createChangeEvent('');

		act(() => {
			result.current.handleChange(event);
		});

		expect(setInternalInputValue).toHaveBeenCalledWith('');
		expect(openList).toHaveBeenCalledTimes(1);
	});
});

describe('useInputCallbacks - handleChange - list opening behavior', () => {
	it('opens list when closed', () => {
		const openList = vi.fn();
		const { result } = renderHookWithProps({
			isOpen: false,
			openList,
		});

		const event = createChangeEvent('test');

		act(() => {
			result.current.handleChange(event);
		});

		expect(openList).toHaveBeenCalledTimes(1);
	});

	it('does not open list when already open', () => {
		const openList = vi.fn();
		const { result } = renderHookWithProps({
			isOpen: true,
			openList,
		});

		const event = createChangeEvent('test');

		act(() => {
			result.current.handleChange(event);
		});

		expect(openList).not.toHaveBeenCalled();
	});
});

describe('useInputCallbacks - handleChange - controlled input', () => {
	it('handles controlled input with onInputValueChange', () => {
		const onInputValueChange = vi.fn();
		const openList = vi.fn();
		const { result } = renderHookWithProps({
			isInputControlled: true,
			onInputValueChange,
			openList,
		});

		const event = createChangeEvent('controlled value');

		act(() => {
			result.current.handleChange(event);
		});

		expect(onInputValueChange).toHaveBeenCalledWith('controlled value');
		expect(openList).toHaveBeenCalledTimes(1);
	});
});

describe('useInputCallbacks - callback memoization', () => {
	it('creates new updateInputValue when dependencies change', () => {
		const setInternalInputValue = vi.fn();
		const { result, rerender } = renderHook(
			({ isInputControlled }: { isInputControlled: boolean }) =>
				useInputCallbacks({
					isInputControlled,
					isOpen: false,
					setInternalInputValue,
					openList: vi.fn(),
				}),
			{
				initialProps: { isInputControlled: false },
			}
		);

		const firstUpdate = result.current.updateInputValue;

		rerender({ isInputControlled: true });

		expect(result.current.updateInputValue).not.toBe(firstUpdate);
	});

	it('creates new handleChange when isOpen changes', () => {
		const { result, rerender } = renderHook(
			({ isOpen }: { isOpen: boolean }) =>
				useInputCallbacks({
					isInputControlled: false,
					isOpen,
					setInternalInputValue: vi.fn(),
					openList: vi.fn(),
				}),
			{
				initialProps: { isOpen: false },
			}
		);

		const firstHandle = result.current.handleChange;

		rerender({ isOpen: true });

		expect(result.current.handleChange).not.toBe(firstHandle);
	});
});
