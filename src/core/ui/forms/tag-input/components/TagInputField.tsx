import { TagInputFieldContainer } from '@core/ui/forms/tag-input/components/TagInputFieldContainer';
import type { TagInputFieldProps } from '@core/ui/forms/tag-input/types/TagInputTypes';
import { classNames } from '@core/utils/classNames';
import type { InputHTMLAttributes, KeyboardEvent } from 'react';

/**
 * Checks if the maximum number of tags has been reached
 */
function isAtMaxTags(tags: readonly string[], maxTags?: number): boolean {
	return maxTags !== undefined && tags.length >= maxTags;
}

/**
 * Determines if the input should be disabled
 */
function getInputDisabledState(
	tags: readonly string[],
	maxTags: number | undefined,
	disabled?: boolean
): boolean {
	return disabled ?? isAtMaxTags(tags, maxTags);
}

/**
 * Gets the placeholder value based on max tags state
 */
function getInputPlaceholder(
	placeholder: string | undefined,
	tags: readonly string[],
	maxTags?: number
): string | undefined {
	return isAtMaxTags(tags, maxTags) ? undefined : placeholder;
}

interface TagInputProps {
	readonly id: string | undefined;
	readonly value: string;
	readonly onChange: (value: string) => void;
	readonly onKeyDown?: ((event: KeyboardEvent<HTMLInputElement>) => void) | undefined;
	readonly disabled: boolean;
	readonly required?: boolean | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly placeholder: string | undefined;
	readonly inputProps: Readonly<
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
		>
	>;
}

/**
 * Renders the input element for tag input
 */
function TagInput({
	id,
	value,
	onChange,
	onKeyDown,
	disabled,
	required,
	hasError,
	ariaDescribedBy,
	placeholder,
	inputProps,
}: Readonly<TagInputProps>) {
	return (
		<input
			id={id}
			type="text"
			value={value}
			onChange={e => onChange(e.target.value)}
			onKeyDown={onKeyDown}
			disabled={disabled}
			required={required}
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
			placeholder={placeholder}
			className={classNames(
				'flex-1 min-w-[120px] border-0 bg-transparent p-0 outline-none',
				'placeholder:text-gray-400',
				'disabled:cursor-not-allowed',
				'dark:placeholder:text-gray-500'
			)}
			{...inputProps}
		/>
	);
}

/**
 * Prepares input props for the TagInput component
 */
function prepareInputProps(
	props: Readonly<TagInputFieldProps>,
	inputDisabled: boolean,
	inputPlaceholder: string | undefined
): Readonly<TagInputProps> {
	return {
		id: props.id,
		value: props.value,
		onChange: props.onChange,
		onKeyDown: props.onKeyDown,
		disabled: inputDisabled,
		required: props.required,
		hasError: props.hasError,
		ariaDescribedBy: props.ariaDescribedBy,
		placeholder: inputPlaceholder,
		inputProps: props.props,
	};
}

export function TagInputField(props: Readonly<TagInputFieldProps>) {
	const {
		className,
		hasError,
		disabled,
		tags,
		onRemoveTag,
		chipSize = 'sm',
		chipVariant = 'default',
		placeholder,
		maxTags,
	} = props;

	const inputDisabled = getInputDisabledState(tags, maxTags, disabled);
	const inputPlaceholder = getInputPlaceholder(placeholder, tags, maxTags);
	const inputProps = prepareInputProps(props, inputDisabled, inputPlaceholder);

	return (
		<div className="relative">
			<TagInputFieldContainer
				tags={tags}
				chipVariant={chipVariant}
				chipSize={chipSize}
				onRemoveTag={onRemoveTag}
				className={className}
				hasError={hasError}
				disabled={disabled}
			>
				<TagInput {...inputProps} />
			</TagInputFieldContainer>
		</div>
	);
}
