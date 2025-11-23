/**
 * useTagInputHandlers Tests
 *
 * Tests for the useTagInputHandlers hook:
 * - Handler creation
 * - Handler memoization
 * - Handler dependencies
 */

import { useTagInputHandlers } from '@core/ui/forms/tag-input/hooks/useTagInput.handlers';
import type { UseTagInputHandlersOptions } from '@core/ui/forms/tag-input/hooks/useTagInput.handlers.types';
import { renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useTagInputHandlers', () => {
	it('should be a function', () => {
		expect(typeof useTagInputHandlers).toBe('function');
	});

	it('returns handleKeyDown and handleRemoveTag', () => {
		const options: UseTagInputHandlersOptions = {
			inputValue: '',
			tags: [],
			disabled: undefined,
			maxTags: undefined,
			allowDuplicates: false,
			separator: /[\n,]/,
			isControlled: false,
			setInternalTags: vi.fn(),
			setInputValue: vi.fn(),
			onChange: vi.fn(),
			handleRemoveTag: vi.fn(),
		};

		const { result } = renderHook(() => useTagInputHandlers(options));

		expect(result.current).toHaveProperty('handleKeyDown');
		expect(result.current).toHaveProperty('handleRemoveTag');
		expect(typeof result.current.handleKeyDown).toBe('function');
		expect(typeof result.current.handleRemoveTag).toBe('function');
	});

	it('returns the same handleRemoveTag function', () => {
		const handleRemoveTag = vi.fn();
		const options: UseTagInputHandlersOptions = {
			inputValue: '',
			tags: [],
			disabled: undefined,
			maxTags: undefined,
			allowDuplicates: false,
			separator: /[\n,]/,
			isControlled: false,
			setInternalTags: vi.fn(),
			setInputValue: vi.fn(),
			onChange: vi.fn(),
			handleRemoveTag,
		};

		const { result } = renderHook(() => useTagInputHandlers(options));

		expect(result.current.handleRemoveTag).toBe(handleRemoveTag);
	});

	it('creates working handleKeyDown handler', () => {
		const setInputValue = vi.fn();
		const onChange = vi.fn();
		const options: UseTagInputHandlersOptions = {
			inputValue: 'newtag',
			tags: ['tag1'],
			disabled: undefined,
			maxTags: undefined,
			allowDuplicates: false,
			separator: /[\n,]/,
			isControlled: false,
			setInternalTags: vi.fn(),
			setInputValue,
			onChange,
			handleRemoveTag: vi.fn(),
		};

		const { result } = renderHook(() => useTagInputHandlers(options));

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		result.current.handleKeyDown(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setInputValue).toHaveBeenCalledWith('');
		expect(onChange).toHaveBeenCalledWith(['tag1', 'newtag']);
	});

	it('memoizes handleKeyDown based on dependencies', () => {
		const options: UseTagInputHandlersOptions = {
			inputValue: '',
			tags: [],
			disabled: undefined,
			maxTags: undefined,
			allowDuplicates: false,
			separator: /[\n,]/,
			isControlled: false,
			setInternalTags: vi.fn(),
			setInputValue: vi.fn(),
			onChange: vi.fn(),
			handleRemoveTag: vi.fn(),
		};

		const { result, rerender } = renderHook(
			(opts: UseTagInputHandlersOptions) => useTagInputHandlers(opts),
			{
				initialProps: options,
			}
		);

		const firstHandler = result.current.handleKeyDown;

		rerender(options);
		expect(result.current.handleKeyDown).toBe(firstHandler);

		rerender({ ...options, inputValue: 'changed' });
		expect(result.current.handleKeyDown).not.toBe(firstHandler);
	});

	it('updates handler when inputValue changes', () => {
		const options: UseTagInputHandlersOptions = {
			inputValue: 'initial',
			tags: [],
			disabled: undefined,
			maxTags: undefined,
			allowDuplicates: false,
			separator: /[\n,]/,
			isControlled: false,
			setInternalTags: vi.fn(),
			setInputValue: vi.fn(),
			onChange: vi.fn(),
			handleRemoveTag: vi.fn(),
		};

		const { result, rerender } = renderHook(
			(opts: UseTagInputHandlersOptions) => useTagInputHandlers(opts),
			{
				initialProps: options,
			}
		);

		const firstHandler = result.current.handleKeyDown;

		rerender({ ...options, inputValue: 'updated' });
		expect(result.current.handleKeyDown).not.toBe(firstHandler);
	});

	it('updates handler when tags change', () => {
		const options: UseTagInputHandlersOptions = {
			inputValue: '',
			tags: ['tag1'],
			disabled: undefined,
			maxTags: undefined,
			allowDuplicates: false,
			separator: /[\n,]/,
			isControlled: false,
			setInternalTags: vi.fn(),
			setInputValue: vi.fn(),
			onChange: vi.fn(),
			handleRemoveTag: vi.fn(),
		};

		const { result, rerender } = renderHook(
			(opts: UseTagInputHandlersOptions) => useTagInputHandlers(opts),
			{
				initialProps: options,
			}
		);

		const firstHandler = result.current.handleKeyDown;

		rerender({ ...options, tags: ['tag1', 'tag2'] });
		expect(result.current.handleKeyDown).not.toBe(firstHandler);
	});

	it('handles disabled state correctly', () => {
		const setInputValue = vi.fn();
		const options: UseTagInputHandlersOptions = {
			inputValue: 'test',
			tags: [],
			disabled: true,
			maxTags: undefined,
			allowDuplicates: false,
			separator: /[\n,]/,
			isControlled: false,
			setInternalTags: vi.fn(),
			setInputValue,
			onChange: vi.fn(),
			handleRemoveTag: vi.fn(),
		};

		const { result } = renderHook(() => useTagInputHandlers(options));

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		result.current.handleKeyDown(event);

		expect(setInputValue).not.toHaveBeenCalled();
	});
});
