import { useOTPInputChangeHandler } from '@core/ui/forms/otp-input/hooks/useOTPInput.changeHandler';
import { useOTPInputFieldProps } from '@core/ui/forms/otp-input/hooks/useOTPInput.fieldProps';
import { useOTPInputState } from '@core/ui/forms/otp-input/hooks/useOTPInput.state';
import type {
	OTPInputProps,
	UseOTPInputChangeHandlerOptions,
	UseOTPInputFieldPropsOptions,
	UseOTPInputPropsOptions,
	UseOTPInputPropsReturn,
} from '@core/ui/forms/otp-input/hooks/useOTPInput.types';
import { useOTPInputValue } from '@core/ui/forms/otp-input/hooks/useOTPInput.value';
import type { StandardSize } from '@src-types/ui/base';
import { useRef } from 'react';

/**
 * Extracts and normalizes OTP input props with default values
 */
function extractOTPInputProps(props: Readonly<OTPInputProps>) {
	const {
		label,
		error,
		helperText,
		fullWidth = false,
		required,
		length = 6,
		value: controlledValue,
		defaultValue = '',
		inputId,
		size = 'md',
		className,
		disabled,
		onChange,
		onComplete,
		autoFocus = true,
	} = props;

	return {
		label,
		error,
		helperText,
		fullWidth,
		required,
		length,
		controlledValue,
		defaultValue,
		inputId,
		size,
		className,
		disabled,
		onChange,
		onComplete,
		autoFocus,
	};
}

interface UseOTPInputStateAndValueOptions {
	readonly inputId: string | undefined;
	readonly label: string | undefined;
	readonly error: string | undefined;
	readonly helperText: string | undefined;
	readonly size: StandardSize;
	readonly className: string | undefined;
	readonly controlledValue: string | undefined;
	readonly defaultValue: string;
	readonly length: number;
}

/**
 * Sets up OTP input state and value hooks
 */
function useOTPInputStateAndValue(options: Readonly<UseOTPInputStateAndValueOptions>) {
	const {
		inputId,
		label,
		error,
		helperText,
		size,
		className,
		controlledValue,
		defaultValue,
		length,
	} = options;

	const state = useOTPInputState({ inputId, label, error, helperText, size, className });
	const { normalizedValue, isControlled, setInternalValue } = useOTPInputValue(
		controlledValue,
		defaultValue,
		length
	);

	return { state, normalizedValue, isControlled, setInternalValue };
}

/**
 * Sets up OTP input change handler
 */
function useOTPInputChangeHandlerSetup(options: Readonly<UseOTPInputChangeHandlerOptions>) {
	return useOTPInputChangeHandler(options);
}

/**
 * Creates refs for OTP input fields
 */
function useOTPInputRefs() {
	return useRef<(HTMLInputElement | null)[]>([]);
}

/**
 * Sets up field props for OTP input
 */
function useOTPInputFieldPropsSetup(options: Readonly<UseOTPInputFieldPropsOptions>) {
	return useOTPInputFieldProps(options);
}

/**
 * Builds the return value for useOTPInputProps
 */
function buildOTPInputPropsReturn(
	state: ReturnType<typeof useOTPInputState>,
	fieldProps: ReturnType<typeof useOTPInputFieldProps>,
	extractedProps: ReturnType<typeof extractOTPInputProps>
): UseOTPInputPropsReturn {
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

/**
 * Hook to process OTPInput component props and return state and field props
 */
export function useOTPInputProps({
	props,
}: Readonly<UseOTPInputPropsOptions>): UseOTPInputPropsReturn {
	const extractedProps = extractOTPInputProps(props);
	const { state, normalizedValue, isControlled, setInternalValue } = useOTPInputStateAndValue({
		inputId: extractedProps.inputId,
		label: extractedProps.label,
		error: extractedProps.error,
		helperText: extractedProps.helperText,
		size: extractedProps.size,
		className: extractedProps.className,
		controlledValue: extractedProps.controlledValue,
		defaultValue: extractedProps.defaultValue,
		length: extractedProps.length,
	});
	const handleChange = useOTPInputChangeHandlerSetup({
		isControlled,
		setInternalValue,
		length: extractedProps.length,
		onChange: extractedProps.onChange,
		onComplete: extractedProps.onComplete,
	});
	const inputRefs = useOTPInputRefs();
	const fieldProps = useOTPInputFieldPropsSetup({
		state,
		disabled: extractedProps.disabled,
		required: extractedProps.required,
		length: extractedProps.length,
		normalizedValue,
		handleChange,
		onComplete: extractedProps.onComplete,
		autoFocus: extractedProps.autoFocus,
		inputRefs,
	});

	return buildOTPInputPropsReturn(state, fieldProps, extractedProps);
}
