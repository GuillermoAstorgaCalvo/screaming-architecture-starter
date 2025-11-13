import type { NumberInputProps } from '@src-types/ui/forms-inputs';

import type { ExtractedNumberInputProps } from './useNumberInput.types';

/**
 * Extracts and destructures NumberInput component props
 *
 * @param props - NumberInput component props
 * @returns Extracted props with defaults applied
 *
 * @internal
 */
export function extractNumberInputProps(
	props: Readonly<NumberInputProps>
): ExtractedNumberInputProps {
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
		min,
		max,
		step = 1,
		value,
		defaultValue,
		onChange,
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
		min,
		max,
		step,
		value,
		defaultValue,
		onChange,
		rest,
	};
}
