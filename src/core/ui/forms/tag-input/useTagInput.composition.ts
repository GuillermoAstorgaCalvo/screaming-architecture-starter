import type { KeyboardEvent } from 'react';

import type { UseTagInputStateReturn } from './TagInputTypes';
import { useTagInputHandlers } from './useTagInput.handlers';
import type { extractTagInputProps } from './useTagInput.props';
import { useInputValueState, useRemoveTagHandler, useTagState } from './useTagInput.state';
import { useTagInputState } from './useTagInput.uiState';

export interface UseTagInputStateAndHandlersOptions {
	readonly extractedProps: ReturnType<typeof extractTagInputProps>;
}

export interface UseTagInputStateAndHandlersReturn {
	readonly state: UseTagInputStateReturn;
	readonly tags: readonly string[];
	readonly inputValue: string;
	readonly handleInputChange: (value: string) => void;
	readonly handleRemoveTag: (tag: string) => void;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Manages tag input state (tags and input value)
 *
 * @param extractedProps - Extracted tag input props
 * @returns Tag state, input value state, and remove tag handler
 *
 * @internal
 */
function useTagInputStateManagement(extractedProps: ReturnType<typeof extractTagInputProps>) {
	const state = useTagInputState({
		inputId: extractedProps.tagInputId,
		label: extractedProps.label,
		error: extractedProps.error,
		helperText: extractedProps.helperText,
		size: extractedProps.size,
		className: extractedProps.className,
	});

	const { tags, isControlled, setInternalTags } = useTagState(
		extractedProps.tags,
		extractedProps.defaultTags
	);
	const { inputValue, setInputValue, handleInputChange } = useInputValueState(
		extractedProps.value,
		extractedProps.defaultValue,
		extractedProps.onValueChange
	);

	const handleRemoveTag = useRemoveTagHandler(tags, extractedProps.onChange, {
		isControlled,
		setInternalTags,
	});

	return {
		state,
		tags,
		inputValue,
		handleInputChange,
		handleRemoveTag,
		isControlled,
		setInternalTags,
		setInputValue,
	};
}

/**
 * Manages tag input state and creates event handlers
 *
 * Combines state management (tags, input value) with handler creation
 * to simplify the main hook.
 *
 * @param options - Options containing extracted props
 * @returns State and handlers for the tag input
 *
 * @internal
 */
export function useTagInputStateAndHandlers(
	options: Readonly<UseTagInputStateAndHandlersOptions>
): UseTagInputStateAndHandlersReturn {
	const { extractedProps } = options;
	const {
		state,
		tags,
		inputValue,
		handleInputChange,
		handleRemoveTag,
		isControlled,
		setInternalTags,
		setInputValue,
	} = useTagInputStateManagement(extractedProps);

	const { handleKeyDown } = useTagInputHandlers({
		inputValue,
		tags,
		disabled: extractedProps.disabled,
		maxTags: extractedProps.maxTags,
		allowDuplicates: extractedProps.allowDuplicates,
		separator: extractedProps.separator,
		isControlled,
		setInternalTags,
		setInputValue,
		onChange: extractedProps.onChange,
		handleRemoveTag,
	});

	return {
		state,
		tags,
		inputValue,
		handleInputChange,
		handleRemoveTag,
		handleKeyDown,
	};
}
