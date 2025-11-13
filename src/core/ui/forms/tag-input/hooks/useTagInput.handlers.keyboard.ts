import { handleAddTag } from '@core/ui/forms/tag-input/hooks/useTagInput.handlers.addTag';
import type { CreateKeyDownHandlerOptions } from '@core/ui/forms/tag-input/hooks/useTagInput.handlers.types';
import type { KeyboardEvent } from 'react';

/**
 * Handles Enter or separator key press
 */
function handleEnterOrSeparator(
	event: KeyboardEvent<HTMLInputElement>,
	trimmedValue: string,
	options: Readonly<CreateKeyDownHandlerOptions>
): boolean {
	const { tags, maxTags, allowDuplicates, isControlled, setInternalTags, setInputValue, onChange } =
		options;

	event.preventDefault();

	const added = handleAddTag({
		trimmedValue,
		tags,
		maxTags,
		allowDuplicates,
		isControlled,
		setInternalTags,
		onChange,
	});

	if (added) {
		setInputValue('');
	}

	return true;
}

/**
 * Handles Backspace key when input is empty
 */
function handleBackspaceOnEmpty(
	event: KeyboardEvent<HTMLInputElement>,
	tags: readonly string[],
	handleRemoveTag: (tag: string) => void
): boolean {
	if (tags.length === 0) return false;

	event.preventDefault();
	const lastTag = tags.at(-1);
	if (lastTag) {
		handleRemoveTag(lastTag);
	}

	return true;
}

/**
 * Creates a keydown handler for the tag input
 */
export function createKeyDownHandler(
	options: Readonly<CreateKeyDownHandlerOptions>
): (event: KeyboardEvent<HTMLInputElement>) => void {
	const { inputValue, tags, disabled, separator, handleRemoveTag } = options;

	return (event: KeyboardEvent<HTMLInputElement>) => {
		if (disabled) return;

		const trimmedValue = inputValue.trim();
		const isEnterOrSeparator =
			event.key === 'Enter' || (typeof separator === 'string' && event.key === separator);
		const isBackspaceOnEmpty = event.key === 'Backspace' && !trimmedValue;

		if (isEnterOrSeparator) {
			handleEnterOrSeparator(event, trimmedValue, options);
		} else if (isBackspaceOnEmpty) {
			handleBackspaceOnEmpty(event, tags, handleRemoveTag);
		}
	};
}
