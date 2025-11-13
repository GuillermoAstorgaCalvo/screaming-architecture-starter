import { useState } from 'react';

import type { UseOTPInputValueReturn } from './useOTPInput.types';

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
