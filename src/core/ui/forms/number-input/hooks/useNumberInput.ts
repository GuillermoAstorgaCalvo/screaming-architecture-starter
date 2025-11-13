import type { NumberInputProps } from '@src-types/ui/forms-inputs';
import { useMemo } from 'react';

import type { NumberInputFieldProps, UseNumberInputStateReturn } from './NumberInputTypes';
import { calculateNumberInputValueAndCapability } from './NumberInputValue';
import type { ExtractedNumberInputProps } from './useNumberInput.types';
import { extractNumberInputProps } from './useNumberInput.utils';
import { useNumberInputFieldProps } from './useNumberInputFieldProps';
import { useNumberInputHandlers } from './useNumberInputHandlers';
import { useNumberInputState } from './useNumberInputState';

export interface UseNumberInputPropsOptions {
	readonly props: Readonly<NumberInputProps>;
}

export interface UseNumberInputPropsReturn {
	readonly state: UseNumberInputStateReturn;
	readonly fieldProps: Readonly<NumberInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

interface UseNumberInputValueAndCapabilityOptions {
	readonly value?: number | string | undefined;
	readonly defaultValue?: number | string | undefined;
	readonly min?: number | undefined;
	readonly max?: number | undefined;
}

/**
 * Hook to calculate number input value and increment/decrement capability
 *
 * Memoizes the calculation of current value and whether increment/decrement
 * operations are allowed based on min/max constraints.
 *
 * @param options - Options containing value, defaultValue, min, and max
 * @returns Memoized value and capability object
 *
 * @internal
 */
function useNumberInputValueAndCapability({
	value,
	defaultValue,
	min,
	max,
}: Readonly<UseNumberInputValueAndCapabilityOptions>) {
	return useMemo(
		() =>
			calculateNumberInputValueAndCapability({
				value,
				defaultValue,
				min,
				max,
			}),
		[value, defaultValue, min, max]
	);
}

interface BuildUseNumberInputPropsReturnOptions {
	readonly state: UseNumberInputStateReturn;
	readonly fieldProps: Readonly<NumberInputFieldProps>;
	readonly extracted: ExtractedNumberInputProps;
}

/**
 * Builds the return object for useNumberInputProps
 *
 * Extracts relevant props from the extracted props object and combines
 * them with state and field props to create the final return value.
 *
 * @param options - Options containing state, field props, and extracted props
 * @returns Complete return object for useNumberInputProps
 *
 * @internal
 */
function buildUseNumberInputPropsReturn({
	state,
	fieldProps,
	extracted,
}: Readonly<BuildUseNumberInputPropsReturnOptions>): UseNumberInputPropsReturn {
	return {
		state,
		fieldProps,
		label: extracted.label,
		error: extracted.error,
		helperText: extracted.helperText,
		required: extracted.required,
		fullWidth: extracted.fullWidth,
	};
}

/**
 * Hook to process NumberInput component props and return state and field props
 *
 * Extracts and processes NumberInput component props, computes state using
 * useNumberInputState, calculates value and capability, creates handlers,
 * and builds field props. Returns all necessary data for rendering the
 * NumberInput component including label, error, helper text, and layout options.
 *
 * @param options - Options containing NumberInput component props
 * @returns Processed state, field props, and extracted props
 */
export function useNumberInputProps({
	props,
}: Readonly<UseNumberInputPropsOptions>): UseNumberInputPropsReturn {
	const extracted = extractNumberInputProps(props);
	const state = useNumberInputState({
		inputId: extracted.inputId,
		label: extracted.label,
		error: extracted.error,
		helperText: extracted.helperText,
		size: extracted.size,
		className: extracted.className,
	});
	const valueAndCapability = useNumberInputValueAndCapability({
		value: extracted.value,
		defaultValue: extracted.defaultValue,
		min: extracted.min,
		max: extracted.max,
	});
	const handlers = useNumberInputHandlers({
		valueAndCapability,
		min: extracted.min,
		max: extracted.max,
		step: extracted.step,
		disabled: extracted.disabled,
		onChange: extracted.onChange,
	});
	const fieldProps = useNumberInputFieldProps({
		state,
		extracted,
		valueAndCapability,
		handlers,
	});
	return buildUseNumberInputPropsReturn({
		state,
		fieldProps,
		extracted,
	});
}
