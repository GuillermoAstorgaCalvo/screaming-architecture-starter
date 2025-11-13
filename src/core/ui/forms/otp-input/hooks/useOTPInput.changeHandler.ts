import type { UseOTPInputChangeHandlerOptions } from '@core/ui/forms/otp-input/hooks/useOTPInput.types';
import { useCallback } from 'react';

/**
 * Creates change handler for OTP input
 */
export function useOTPInputChangeHandler(options: Readonly<UseOTPInputChangeHandlerOptions>) {
	const { isControlled, setInternalValue, length, onChange, onComplete } = options;
	return useCallback(
		(newValue: string) => {
			if (!isControlled) {
				setInternalValue(newValue);
			}
			onChange?.(newValue);
			if (newValue.length === length) {
				onComplete?.(newValue);
			}
		},
		[isControlled, setInternalValue, length, onChange, onComplete]
	);
}
