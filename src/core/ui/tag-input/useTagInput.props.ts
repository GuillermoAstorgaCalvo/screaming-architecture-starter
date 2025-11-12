import type { StandardSize } from '@src-types/ui/base';
import type { TagInputProps } from '@src-types/ui/forms-inputs';
import type { InputHTMLAttributes } from 'react';

export interface ExtractedTagInputProps {
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly fullWidth: boolean;
	readonly tagInputId?: string | undefined;
	readonly className?: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly value?: string | undefined;
	readonly defaultValue?: string | undefined;
	readonly onChange?: ((tags: string[]) => void) | undefined;
	readonly onValueChange?: ((value: string) => void) | undefined;
	readonly tags?: string[] | undefined;
	readonly defaultTags?: string[] | undefined;
	readonly chipSize?: StandardSize | undefined;
	readonly chipVariant?:
		| 'default'
		| 'primary'
		| 'success'
		| 'warning'
		| 'error'
		| 'info'
		| undefined;
	readonly placeholder?: string | undefined;
	readonly maxTags?: number | undefined;
	readonly separator: string | RegExp;
	readonly allowDuplicates: boolean;
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
 * Extracts form-related props (label, error, size, etc.)
 *
 * @internal
 */
function extractFormProps(props: Readonly<TagInputProps>) {
	const {
		label,
		error,
		helperText,
		size = 'md',
		fullWidth = false,
		tagInputId,
		className,
		disabled,
		required,
	} = props;

	return {
		label,
		error,
		helperText,
		size,
		fullWidth,
		tagInputId,
		className,
		disabled,
		required,
	};
}

/**
 * Extracts input value-related props (value, defaultValue, onChange, etc.)
 *
 * @internal
 */
function extractInputValueProps(props: Readonly<TagInputProps>) {
	const { value: controlledValue, defaultValue, onChange, onValueChange } = props;

	return {
		value: controlledValue,
		defaultValue,
		onChange,
		onValueChange,
	};
}

/**
 * Extracts tag-related props (tags, defaultTags, chipSize, chipVariant)
 *
 * @internal
 */
function extractTagProps(props: Readonly<TagInputProps>) {
	const { tags: controlledTags, defaultTags, chipSize, chipVariant } = props;

	return {
		tags: controlledTags,
		defaultTags,
		chipSize,
		chipVariant,
	};
}

/**
 * Extracts tag behavior-related props (placeholder, maxTags, separator, allowDuplicates)
 *
 * @internal
 */
function extractTagBehaviorProps(props: Readonly<TagInputProps>) {
	const { placeholder, maxTags, separator = /[\n,]/, allowDuplicates = false } = props;

	return {
		placeholder,
		maxTags,
		separator,
		allowDuplicates,
	};
}

type RestInputProps = Readonly<
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

/**
 * Extracts remaining InputHTMLAttributes props (excluding handled props)
 * @internal
 */
function extractRestProps(props: Readonly<TagInputProps>) {
	const {
		label: _label,
		error: _error,
		helperText: _helperText,
		size: _size,
		fullWidth: _fullWidth,
		tagInputId: _tagInputId,
		className: _className,
		disabled: _disabled,
		required: _required,
		value: _value,
		defaultValue: _defaultValue,
		onChange: _onChange,
		onValueChange: _onValueChange,
		tags: _tags,
		defaultTags: _defaultTags,
		chipSize: _chipSize,
		chipVariant: _chipVariant,
		placeholder: _placeholder,
		maxTags: _maxTags,
		separator: _separator,
		allowDuplicates: _allowDuplicates,
		...rest
	} = props;

	return { rest: rest as RestInputProps };
}

/**
 * Extracts and normalizes TagInput props with default values
 *
 * Separates the props extraction logic from the main hook to improve
 * readability and testability.
 *
 * @param props - Raw TagInput component props
 * @returns Extracted and normalized props with defaults applied
 *
 * @internal
 */
export function extractTagInputProps(props: Readonly<TagInputProps>): ExtractedTagInputProps {
	const formProps = extractFormProps(props);
	const inputValueProps = extractInputValueProps(props);
	const tagProps = extractTagProps(props);
	const behaviorProps = extractTagBehaviorProps(props);
	const { rest } = extractRestProps(props);

	return {
		...formProps,
		...inputValueProps,
		...tagProps,
		...behaviorProps,
		rest,
	};
}
