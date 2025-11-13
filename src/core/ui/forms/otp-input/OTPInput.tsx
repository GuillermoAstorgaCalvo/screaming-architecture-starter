import { OTPInputContent } from '@core/ui/forms/otp-input/components/OTPInputContent';
import { useOTPInputProps } from '@core/ui/forms/otp-input/hooks/useOTPInput';
import type { OTPInputProps } from '@core/ui/forms/otp-input/hooks/useOTPInput.types';

/**
 * OTPInput - One-time password input component for authentication flows
 *
 * Features:
 * - Multi-digit input with individual input fields
 * - Auto-focus on first input when mounted
 * - Auto-advance to next input when digit is entered
 * - Paste support: paste full code and it distributes across inputs
 * - Keyboard navigation: arrow keys, backspace, delete
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 *
 * @example
 * ```tsx
 * <OTPInput
 *   label="Verification Code"
 *   length={6}
 *   onComplete={(value) => console.log('Code:', value)}
 *   error={errors.code}
 *   helperText="Enter the 6-digit code sent to your email"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <OTPInput
 *   value={code}
 *   onChange={setCode}
 *   length={4}
 *   size="lg"
 *   autoFocus
 * />
 * ```
 */
export default function OTPInput(props: Readonly<OTPInputProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } = useOTPInputProps({
		props,
	});
	return (
		<OTPInputContent
			state={state}
			fieldProps={fieldProps}
			label={label}
			error={error}
			helperText={helperText}
			required={required}
			fullWidth={fullWidth}
		/>
	);
}
