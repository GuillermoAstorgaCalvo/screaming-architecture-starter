import type { StandardSize } from '@src-types/ui/base';
import type { SearchInputProps } from '@src-types/ui/forms-inputs';
import type { InputHTMLAttributes } from 'react';

export interface ExtractedSearchInputProps {
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly fullWidth: boolean;
	readonly inputId?: string | undefined;
	readonly className?: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly value?: string | undefined;
	readonly defaultValue?: string | undefined;
	readonly onChange?: ((value: string) => void) | undefined;
	readonly showClearButtonProp?: boolean | undefined;
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
			| 'type'
			| 'value'
			| 'onChange'
			| 'defaultValue'
		>
	>;
}

/**
 * Extracts and destructures SearchInput props with default values
 *
 * Separates the props into individual variables with appropriate defaults
 * and groups the remaining props for forwarding to the input element.
 *
 * @param props - SearchInput component props
 * @returns Extracted props with defaults applied
 *
 * @internal
 */
export function extractSearchInputProps(
	props: Readonly<SearchInputProps>
): ExtractedSearchInputProps {
	const {
		label,
		error,
		helperText,
		size = 'md',
		fullWidth = false,
		inputId,
		className,
		disabled,
		required,
		value,
		defaultValue,
		onChange,
		showClearButton: showClearButtonProp,
		...rest
	} = props;

	return {
		label,
		error,
		helperText,
		size,
		fullWidth,
		inputId,
		className,
		disabled,
		required,
		value,
		defaultValue,
		onChange,
		showClearButtonProp,
		rest,
	};
}
