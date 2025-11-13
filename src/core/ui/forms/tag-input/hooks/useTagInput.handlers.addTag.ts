import {
	isDuplicateTag,
	isValidTag,
	normalizeTag,
} from '@core/ui/forms/tag-input/helpers/TagInputHelpers';
import type { HandleAddTagOptions } from '@core/ui/forms/tag-input/hooks/useTagInput.handlers.types';

/**
 * Handles adding a new tag from the input value
 */
export function handleAddTag(options: Readonly<HandleAddTagOptions>): boolean {
	const { trimmedValue, tags, maxTags, allowDuplicates, isControlled, setInternalTags, onChange } =
		options;

	if (!trimmedValue) return false;

	// Check max tags limit
	if (maxTags !== undefined && tags.length >= maxTags) {
		return false;
	}

	// Validate and add tag
	if (!isValidTag(trimmedValue)) {
		return false;
	}

	const normalized = normalizeTag(trimmedValue);

	// Check for duplicates
	if (!allowDuplicates && isDuplicateTag(normalized, tags)) {
		return false;
	}

	const newTags = [...tags, normalized];
	if (!isControlled) {
		setInternalTags(newTags);
	}
	onChange?.(newTags);
	return true;
}
