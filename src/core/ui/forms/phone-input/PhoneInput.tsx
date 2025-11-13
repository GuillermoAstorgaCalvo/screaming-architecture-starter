import { PhoneInputContent } from '@core/ui/forms/phone-input/components/PhoneInputContent';
import { usePhoneInputProps } from '@core/ui/forms/phone-input/hooks/usePhoneInput';
import type { PhoneInputProps } from '@src-types/ui/forms-specialized';

/**
 * PhoneInput - Phone number input with country code selector
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Country code selector dropdown (left side)
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Supports 30+ common country codes
 * - Dynamic padding based on country code length
 *
 * @example
 * ```tsx
 * <PhoneInput
 *   label="Phone Number"
 *   placeholder="1234567890"
 *   required
 *   error={errors.phone}
 *   helperText="Enter your phone number"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <PhoneInput
 *   label="Mobile"
 *   defaultCountryCode="+44"
 *   onCountryCodeChange={(code) => console.log('Country code:', code)}
 *   size="lg"
 *   fullWidth
 * />
 * ```
 */
export default function PhoneInput(props: Readonly<PhoneInputProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } = usePhoneInputProps({
		props,
	});
	return (
		<PhoneInputContent
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
