import { TextareaContent } from '@core/ui/forms/textarea/components/TextareaContent';
import { useTextareaProps } from '@core/ui/forms/textarea/hooks/useTextarea';
import type { TextareaProps } from '@src-types/ui/forms';

/**
 * Textarea - Reusable textarea component with label, error, and helper text support
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Vertically resizable via native browser behavior (CSS resize property)
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Message"
 *   placeholder="Enter your message"
 *   required
 *   error={errors.message}
 *   helperText="Minimum 10 characters"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Comments"
 *   size="lg"
 *   fullWidth
 *   rows={6}
 * />
 * ```
 */
export default function Textarea(props: Readonly<TextareaProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } = useTextareaProps({
		props,
	});
	return (
		<TextareaContent
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
