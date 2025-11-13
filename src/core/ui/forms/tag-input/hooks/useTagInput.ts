import { useTagInputStateAndHandlers } from '@core/ui/forms/tag-input/hooks/useTagInput.composition';
import { buildTagInputFieldProps } from '@core/ui/forms/tag-input/hooks/useTagInput.fieldProps';
import { extractTagInputProps } from '@core/ui/forms/tag-input/hooks/useTagInput.props';
import type {
	TagInputFieldProps,
	UseTagInputStateReturn,
} from '@core/ui/forms/tag-input/types/TagInputTypes';
import type { TagInputProps } from '@src-types/ui/forms-inputs';

export interface UseTagInputPropsOptions {
	readonly props: Readonly<TagInputProps>;
}

export interface UseTagInputPropsReturn {
	readonly state: UseTagInputStateReturn;
	readonly fieldProps: Readonly<TagInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

/**
 * Hook to process TagInput component props and return state and field props
 *
 * Extracts and processes TagInput component props, computes state using
 * useTagInputState, and builds field props. Returns all necessary data
 * for rendering the TagInput component including label, error, helper text,
 * and layout options.
 *
 * @param options - Options containing TagInput component props
 * @returns Processed state, field props, and extracted props
 */
export function useTagInputProps({
	props,
}: Readonly<UseTagInputPropsOptions>): UseTagInputPropsReturn {
	const extractedProps = extractTagInputProps(props);
	const { state, tags, inputValue, handleInputChange, handleRemoveTag, handleKeyDown } =
		useTagInputStateAndHandlers({ extractedProps });

	const fieldProps = buildTagInputFieldProps({
		state,
		disabled: extractedProps.disabled,
		required: extractedProps.required,
		tags,
		onRemoveTag: handleRemoveTag,
		chipSize: extractedProps.chipSize,
		chipVariant: extractedProps.chipVariant,
		value: inputValue,
		onChange: handleInputChange,
		onKeyDown: handleKeyDown,
		placeholder: extractedProps.placeholder,
		maxTags: extractedProps.maxTags,
		rest: extractedProps.rest,
	});

	return {
		state,
		fieldProps,
		label: extractedProps.label,
		error: extractedProps.error,
		helperText: extractedProps.helperText,
		required: extractedProps.required,
		fullWidth: extractedProps.fullWidth,
	};
}
