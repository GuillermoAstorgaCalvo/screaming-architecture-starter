import { useId } from 'react';

import { generateOTPInputId, getAriaDescribedBy, getOTPInputClasses } from './OTPInputHelpers';
import type { UseOTPInputStateOptions, UseOTPInputStateReturn } from './OTPInputTypes';

/**
 * Hook to compute OTP input state (ID, error state, ARIA attributes, and classes)
 */
export function useOTPInputState({
	inputId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseOTPInputStateOptions>): UseOTPInputStateReturn {
	const generatedId = useId();
	const finalId = generateOTPInputId(generatedId, inputId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getOTPInputClasses({
		size,
		hasError,
		className,
	});
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}
