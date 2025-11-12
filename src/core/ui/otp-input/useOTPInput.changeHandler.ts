import { useCallback } from 'react';

import type { UseOTPInputChangeHandlerOptions } from './useOTPInput.types';

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
