import { type KeyboardEvent, useCallback } from 'react';

import { createKeyDownHandler } from './useTagInput.handlers.keyboard';
import type {
	CreateKeyDownHandlerOptions,
	HandlerOptionsParams,
	UseTagInputHandlersOptions,
	UseTagInputHandlersReturn,
} from './useTagInput.handlers.types';

/**
 * Builds handler options from individual parameters
 */
function buildHandlerOptionsFromParams(
	params: Readonly<HandlerOptionsParams>
): Readonly<CreateKeyDownHandlerOptions> {
	const {
		inputValue,
		tags,
		disabled,
		maxTags,
		allowDuplicates,
		separator,
		isControlled,
		onChange,
		handleRemoveTag,
		setInternalTags,
		setInputValue,
	} = params;
	return {
		inputValue,
		tags,
		disabled,
		maxTags,
		allowDuplicates,
		separator,
		isControlled,
		onChange,
		handleRemoveTag,
		setInternalTags,
		setInputValue,
	};
}

/**
 * Hook to create tag input event handlers
 *
 * Creates the key down handler and remove tag handler for the tag input.
 * This separation makes the handlers easier to test and reason about.
 *
 * @param options - Options for creating handlers
 * @returns Object containing handleKeyDown and handleRemoveTag handlers
 *
 * @internal
 */
export function useTagInputHandlers(
	options: Readonly<UseTagInputHandlersOptions>
): UseTagInputHandlersReturn {
	const {
		inputValue,
		tags,
		disabled,
		maxTags,
		allowDuplicates,
		separator,
		isControlled,
		onChange,
		handleRemoveTag,
		setInternalTags,
		setInputValue,
	} = options;

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			const handlerOptions = buildHandlerOptionsFromParams({
				inputValue,
				tags,
				disabled,
				maxTags,
				allowDuplicates,
				separator,
				isControlled,
				onChange,
				handleRemoveTag,
				setInternalTags,
				setInputValue,
			});
			createKeyDownHandler(handlerOptions)(event);
		},
		[
			inputValue,
			tags,
			disabled,
			maxTags,
			allowDuplicates,
			separator,
			isControlled,
			onChange,
			handleRemoveTag,
			setInternalTags,
			setInputValue,
		]
	);

	return { handleKeyDown, handleRemoveTag };
}
