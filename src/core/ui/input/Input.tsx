import type { InputProps } from '@src-types/ui';

import { InputContent } from './InputParts';
import { useInputProps } from './useInput';

export type { InputProps, StandardSize as InputSize } from '@src-types/ui';

/**
 * Input - Reusable input component with label, error, and helper text support
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Icon support: left and right icons
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   required
 *   error={errors.email}
 *   helperText="We'll never share your email"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Input
 *   label="Search"
 *   leftIcon={<SearchIcon />}
 *   rightIcon={<ClearIcon />}
 *   size="lg"
 *   fullWidth
 * />
 * ```
 */
export default function Input(props: Readonly<InputProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } = useInputProps({
		props,
	});
	return (
		<InputContent
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
