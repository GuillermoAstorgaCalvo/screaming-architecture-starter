import type {
	TagInputFieldProps,
	UseTagInputStateReturn,
} from '@core/ui/forms/tag-input/types/TagInputTypes';
import type { StandardSize } from '@src-types/ui/base';
import type { InputHTMLAttributes, KeyboardEvent } from 'react';

export interface BuildTagInputFieldPropsOptions {
	readonly state: UseTagInputStateReturn;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly tags: readonly string[];
	readonly onRemoveTag: (tag: string) => void;
	readonly chipSize?: StandardSize | undefined;
	readonly chipVariant?:
		| 'default'
		| 'primary'
		| 'success'
		| 'warning'
		| 'error'
		| 'info'
		| undefined;
	readonly value: string;
	readonly onChange: (value: string) => void;
	readonly onKeyDown?: ((event: KeyboardEvent<HTMLInputElement>) => void) | undefined;
	readonly placeholder?: string | undefined;
	readonly maxTags?: number | undefined;
	readonly rest: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'value'
			| 'onChange'
			| 'onKeyDown'
			| 'placeholder'
		>
	>;
}

/**
 * Builds field props object for the TagInputField component
 *
 * Combines computed state with additional props to create the final
 * field props object that will be passed to the TagInputField component.
 *
 * @param options - Options containing state and field-specific props
 * @returns Complete field props object
 *
 * @internal
 */
export function buildTagInputFieldProps(
	options: Readonly<BuildTagInputFieldPropsOptions>
): Readonly<TagInputFieldProps> {
	const {
		state,
		disabled,
		required,
		tags,
		onRemoveTag,
		chipSize,
		chipVariant,
		value,
		onChange,
		onKeyDown,
		placeholder,
		maxTags,
		rest,
	} = options;
	return {
		id: state.finalId,
		className: state.inputClasses,
		hasError: state.hasError,
		ariaDescribedBy: state.ariaDescribedBy,
		disabled,
		required,
		tags,
		onRemoveTag,
		chipSize,
		chipVariant,
		value,
		onChange,
		onKeyDown,
		placeholder,
		maxTags,
		props: rest,
	};
}
