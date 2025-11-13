import type { UseOTPInputValueReturn } from '@core/ui/forms/otp-input/hooks/useOTPInput.types';
import { useState } from 'react';

/**
 * Manages OTP input value state (controlled or uncontrolled)
 */
export function useOTPInputValue(
	controlledValue: string | undefined,
	defaultValue: string,
	length: number
): UseOTPInputValueReturn {
	const [internalValue, setInternalValue] = useState<string>(defaultValue);
	const isControlled = controlledValue !== undefined;
	const currentValue = isControlled ? controlledValue : internalValue;
	const normalizedValue = currentValue.slice(0, length);

	return { normalizedValue, isControlled, setInternalValue };
}
