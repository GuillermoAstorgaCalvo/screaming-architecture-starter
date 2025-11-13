import { PasswordInputContent } from '@core/ui/forms/password-input/components/PasswordInputContent';
import { usePasswordInputProps } from '@core/ui/forms/password-input/hooks/usePasswordInput';
import type { PasswordInputProps } from '@src-types/ui/forms-specialized';

/**
 * PasswordInput - Password input with show/hide visibility toggle
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Built-in visibility toggle button (eye icon)
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Toggle button shows/hides password text
 *
 * @example
 * ```tsx
 * <PasswordInput
 *   label="Password"
 *   placeholder="Enter your password"
 *   required
 *   error={errors.password}
 *   helperText="Must be at least 8 characters"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <PasswordInput
 *   label="Confirm Password"
 *   placeholder="Confirm your password"
 *   size="lg"
 *   fullWidth
 * />
 * ```
 */
export default function PasswordInput(props: Readonly<PasswordInputProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } =
		usePasswordInputProps({
			props,
		});
	return (
		<PasswordInputContent
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
