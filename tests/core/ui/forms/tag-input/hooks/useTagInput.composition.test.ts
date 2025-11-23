/**
 * useTagInputStateAndHandlers Tests
 *
 * Tests for the useTagInputStateAndHandlers hook:
 * - State management integration
 * - Handler creation
 * - Combined functionality
 */

import { useTagInputStateAndHandlers } from '@core/ui/forms/tag-input/hooks/useTagInput.composition';
import { extractTagInputProps } from '@core/ui/forms/tag-input/hooks/useTagInput.props';
import type { TagInputProps } from '@src-types/ui/forms-inputs';
import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useTagInputStateAndHandlers', () => {
	it('should be a function', () => {
		expect(typeof useTagInputStateAndHandlers).toBe('function');
	});

	it('returns all expected properties', () => {
		const props: TagInputProps = {};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		expect(result.current).toHaveProperty('state');
		expect(result.current).toHaveProperty('tags');
		expect(result.current).toHaveProperty('inputValue');
		expect(result.current).toHaveProperty('handleInputChange');
		expect(result.current).toHaveProperty('handleRemoveTag');
		expect(result.current).toHaveProperty('handleKeyDown');
	});

	it('initializes with empty tags and input value', () => {
		const props: TagInputProps = {};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		expect(result.current.tags).toEqual([]);
		expect(result.current.inputValue).toBe('');
	});

	it('initializes with defaultTags when provided', () => {
		const props: TagInputProps = {
			defaultTags: ['tag1', 'tag2'],
		};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		expect(result.current.tags).toEqual(['tag1', 'tag2']);
	});

	it('initializes with defaultValue when provided', () => {
		const props: TagInputProps = {
			defaultValue: 'initial value',
		};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		expect(result.current.inputValue).toBe('initial value');
	});

	it('uses controlled tags when provided', () => {
		const props: TagInputProps = {
			tags: ['controlled1', 'controlled2'],
		};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		expect(result.current.tags).toEqual(['controlled1', 'controlled2']);
	});

	it('uses controlled value when provided', () => {
		const props: TagInputProps = {
			value: 'controlled value',
		};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		expect(result.current.inputValue).toBe('controlled value');
	});

	it('handles input value changes', () => {
		const props: TagInputProps = {};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		act(() => {
			result.current.handleInputChange('new value');
		});

		expect(result.current.inputValue).toBe('new value');
	});

	it('calls onValueChange when input changes', () => {
		const onValueChange = vi.fn();
		const props: TagInputProps = {
			onValueChange,
		};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		act(() => {
			result.current.handleInputChange('new value');
		});

		expect(onValueChange).toHaveBeenCalledWith('new value');
	});

	it('handles tag removal', () => {
		const onChange = vi.fn();
		const props: TagInputProps = {
			defaultTags: ['tag1', 'tag2', 'tag3'],
			onChange,
		};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		act(() => {
			result.current.handleRemoveTag('tag2');
		});

		expect(result.current.tags).toEqual(['tag1', 'tag3']);
		expect(onChange).toHaveBeenCalledWith(['tag1', 'tag3']);
	});

	it('handles key down events', () => {
		const onChange = vi.fn();
		const props: TagInputProps = {
			defaultTags: ['tag1'],
			onChange,
		};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		act(() => {
			result.current.handleInputChange('newtag');
		});

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(result.current.inputValue).toBe('');
		expect(onChange).toHaveBeenCalledWith(['tag1', 'newtag']);
	});

	it('handles backspace to remove last tag', () => {
		const onChange = vi.fn();
		const props: TagInputProps = {
			defaultTags: ['tag1', 'tag2'],
			onChange,
		};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		act(() => {
			result.current.handleInputChange('');
		});

		const event = {
			key: 'Backspace',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onChange).toHaveBeenCalledWith(['tag1']);
	});

	it('respects maxTags limit', () => {
		const onChange = vi.fn();
		const props: TagInputProps = {
			defaultTags: ['tag1', 'tag2'],
			maxTags: 2,
			onChange,
		};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		act(() => {
			result.current.handleInputChange('tag3');
		});

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(result.current.tags).toEqual(['tag1', 'tag2']);
	});

	it('respects allowDuplicates setting', () => {
		const onChange = vi.fn();
		const props: TagInputProps = {
			defaultTags: ['tag1'],
			allowDuplicates: false,
			onChange,
		};
		const extractedProps = extractTagInputProps(props);

		const { result } = renderHook(() => useTagInputStateAndHandlers({ extractedProps }));

		act(() => {
			result.current.handleInputChange('tag1');
		});

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(event);
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(result.current.tags).toEqual(['tag1']);
	});
});
