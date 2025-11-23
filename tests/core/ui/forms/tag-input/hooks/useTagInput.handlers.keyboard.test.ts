/**
 * createKeyDownHandler Tests
 *
 * Tests for the createKeyDownHandler function:
 * - Enter key handling
 * - Separator key handling
 * - Backspace key handling
 * - Disabled state
 */

import { createKeyDownHandler } from '@core/ui/forms/tag-input/hooks/useTagInput.handlers.keyboard';
import type { CreateKeyDownHandlerOptions } from '@core/ui/forms/tag-input/hooks/useTagInput.handlers.types';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('createKeyDownHandler', () => {
	it('should be a function', () => {
		expect(typeof createKeyDownHandler).toBe('function');
	});

	it('returns a function', () => {
		const options: CreateKeyDownHandlerOptions = {
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

		const handler = createKeyDownHandler(options);
		expect(typeof handler).toBe('function');
	});

	it('does nothing when disabled is true', () => {
		const setInputValue = vi.fn();
		const handleRemoveTag = vi.fn();
		const options: CreateKeyDownHandlerOptions = {
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
			handleRemoveTag,
		};

		const handler = createKeyDownHandler(options);
		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		handler(event);

		expect(setInputValue).not.toHaveBeenCalled();
		expect(handleRemoveTag).not.toHaveBeenCalled();
	});

	it('handles Enter key to add tag', () => {
		const setInputValue = vi.fn();
		const onChange = vi.fn();
		const options: CreateKeyDownHandlerOptions = {
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

		const handler = createKeyDownHandler(options);
		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		handler(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setInputValue).toHaveBeenCalledWith('');
		expect(onChange).toHaveBeenCalledWith(['tag1', 'newtag']);
	});

	it('handles separator key (comma) to add tag', () => {
		const setInputValue = vi.fn();
		const onChange = vi.fn();
		const options: CreateKeyDownHandlerOptions = {
			inputValue: 'newtag',
			tags: ['tag1'],
			disabled: undefined,
			maxTags: undefined,
			allowDuplicates: false,
			separator: ',',
			isControlled: false,
			setInternalTags: vi.fn(),
			setInputValue,
			onChange,
			handleRemoveTag: vi.fn(),
		};

		const handler = createKeyDownHandler(options);
		const event = {
			key: ',',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		handler(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(setInputValue).toHaveBeenCalledWith('');
		expect(onChange).toHaveBeenCalledWith(['tag1', 'newtag']);
	});

	it('handles Backspace key when input is empty to remove last tag', () => {
		const handleRemoveTag = vi.fn();
		const options: CreateKeyDownHandlerOptions = {
			inputValue: '',
			tags: ['tag1', 'tag2', 'tag3'],
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

		const handler = createKeyDownHandler(options);
		const event = {
			key: 'Backspace',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		handler(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(handleRemoveTag).toHaveBeenCalledWith('tag3');
	});

	it('does not remove tag on Backspace when input has value', () => {
		const handleRemoveTag = vi.fn();
		const options: CreateKeyDownHandlerOptions = {
			inputValue: 'test',
			tags: ['tag1', 'tag2'],
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

		const handler = createKeyDownHandler(options);
		const event = {
			key: 'Backspace',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		handler(event);

		expect(handleRemoveTag).not.toHaveBeenCalled();
	});

	it('does not remove tag on Backspace when tags array is empty', () => {
		const handleRemoveTag = vi.fn();
		const options: CreateKeyDownHandlerOptions = {
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

		const handler = createKeyDownHandler(options);
		const event = {
			key: 'Backspace',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		handler(event);

		expect(handleRemoveTag).not.toHaveBeenCalled();
	});

	it('trims input value before adding tag', () => {
		const setInputValue = vi.fn();
		const onChange = vi.fn();
		const options: CreateKeyDownHandlerOptions = {
			inputValue: '  newtag  ',
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

		const handler = createKeyDownHandler(options);
		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		handler(event);

		expect(setInputValue).toHaveBeenCalledWith('');
		expect(onChange).toHaveBeenCalledWith(['tag1', 'newtag']);
	});

	it('does not add tag when trimmed value is empty', () => {
		const setInputValue = vi.fn();
		const onChange = vi.fn();
		const options: CreateKeyDownHandlerOptions = {
			inputValue: '   ',
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

		const handler = createKeyDownHandler(options);
		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		handler(event);

		expect(onChange).not.toHaveBeenCalled();
	});

	it('handles other keys without action', () => {
		const setInputValue = vi.fn();
		const handleRemoveTag = vi.fn();
		const options: CreateKeyDownHandlerOptions = {
			inputValue: 'test',
			tags: ['tag1'],
			disabled: undefined,
			maxTags: undefined,
			allowDuplicates: false,
			separator: /[\n,]/,
			isControlled: false,
			setInternalTags: vi.fn(),
			setInputValue,
			onChange: vi.fn(),
			handleRemoveTag,
		};

		const handler = createKeyDownHandler(options);
		const event = {
			key: 'a',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<HTMLInputElement>;

		handler(event);

		expect(setInputValue).not.toHaveBeenCalled();
		expect(handleRemoveTag).not.toHaveBeenCalled();
	});
});
