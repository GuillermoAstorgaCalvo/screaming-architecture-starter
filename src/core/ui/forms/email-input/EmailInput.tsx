import type { EmailInputProps } from '@src-types/ui/forms-specialized';

import { EmailInputContent } from './EmailInputContent';
import { useEmailInputProps } from './useEmailInput';

/**
 * EmailInput - Email input with built-in validation UI
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Built-in email type validation
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Visual validation feedback
 *
 * @example
 * ```tsx
 * <EmailInput
 *   label="Email"
 *   placeholder="Enter your email"
 *   required
 *   error={errors.email}
 *   helperText="We'll never share your email"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <EmailInput
 *   label="Work Email"
 *   placeholder="name@company.com"
 *   size="lg"
 *   fullWidth
 * />
 * ```
 */
export default function EmailInput(props: Readonly<EmailInputProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } = useEmailInputProps({
		props,
	});
	return (
		<EmailInputContent
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
