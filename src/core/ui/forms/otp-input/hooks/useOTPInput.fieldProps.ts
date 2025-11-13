import type { UseOTPInputFieldPropsOptions } from '@core/ui/forms/otp-input/hooks/useOTPInput.types';
import type { OTPInputFieldProps } from '@core/ui/forms/otp-input/types/OTPInputTypes';
import { useMemo } from 'react';

/**
 * Builds accessibility-related field props
 */
function buildAccessibilityProps(
	state: Readonly<UseOTPInputFieldPropsOptions['state']>
): Pick<OTPInputFieldProps, 'id' | 'hasError' | 'ariaDescribedBy'> {
	return {
		id: state.finalId,
		hasError: state.hasError,
		ariaDescribedBy: state.ariaDescribedBy,
	};
}

/**
 * Builds styling-related field props
 */
function buildStylingProps(
	state: Readonly<UseOTPInputFieldPropsOptions['state']>
): Pick<OTPInputFieldProps, 'className'> {
	return {
		className: state.inputClasses,
	};
}

/**
 * Builds input state-related field props
 */
function buildInputStateProps(
	disabled: boolean | undefined,
	required: boolean | undefined,
	length: number
): Pick<OTPInputFieldProps, 'disabled' | 'required' | 'length'> {
	return {
		disabled,
		required,
		length,
	};
}

/**
 * Builds value and change handler field props
 */
function buildValueProps(
	normalizedValue: string,
	handleChange: (value: string) => void,
	onComplete: ((value: string) => void) | undefined
): Pick<OTPInputFieldProps, 'value' | 'onChange' | 'onComplete'> {
	return {
		value: normalizedValue,
		onChange: handleChange,
		onComplete,
	};
}

/**
 * Builds focus-related field props
 */
function buildFocusProps(
	autoFocus: boolean | undefined,
	inputRefs: Readonly<UseOTPInputFieldPropsOptions['inputRefs']>
): Pick<OTPInputFieldProps, 'autoFocus' | 'inputRefs'> {
	return {
		autoFocus,
		inputRefs,
	};
}

/**
 * Combines all field props into a single object
 */
function combineFieldProps(
	state: Readonly<UseOTPInputFieldPropsOptions['state']>,
	inputConfig: {
		readonly disabled: boolean | undefined;
		readonly required: boolean | undefined;
		readonly length: number;
		readonly normalizedValue: string;
		readonly handleChange: (value: string) => void;
		readonly onComplete: ((value: string) => void) | undefined;
	},
	focusConfig: {
		readonly autoFocus: boolean | undefined;
		readonly inputRefs: Readonly<UseOTPInputFieldPropsOptions['inputRefs']>;
	}
): OTPInputFieldProps {
	return {
		...buildAccessibilityProps(state),
		...buildStylingProps(state),
		...buildInputStateProps(inputConfig.disabled, inputConfig.required, inputConfig.length),
		...buildValueProps(
			inputConfig.normalizedValue,
			inputConfig.handleChange,
			inputConfig.onComplete
		),
		...buildFocusProps(focusConfig.autoFocus, focusConfig.inputRefs),
	};
}

/**
 * Builds field props for OTP input
 */
export function useOTPInputFieldProps(
	options: Readonly<UseOTPInputFieldPropsOptions>
): Readonly<OTPInputFieldProps> {
	const {
		state,
		disabled,
		required,
		length,
		normalizedValue,
		handleChange,
		onComplete,
		autoFocus,
		inputRefs,
	} = options;

	const inputConfig = useMemo(
		() => ({
			disabled,
			required,
			length,
			normalizedValue,
			handleChange,
			onComplete,
		}),
		[disabled, required, length, normalizedValue, handleChange, onComplete]
	);

	const focusConfig = useMemo(
		() => ({
			autoFocus,
			inputRefs,
		}),
		[autoFocus, inputRefs]
	);

	return useMemo(
		() => combineFieldProps(state, inputConfig, focusConfig),
		[state, inputConfig, focusConfig]
	);
}
