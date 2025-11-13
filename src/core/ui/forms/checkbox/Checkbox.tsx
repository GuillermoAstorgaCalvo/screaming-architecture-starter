import { CheckboxContent } from '@core/ui/forms/checkbox/components/CheckboxContent';
import { useCheckboxProps } from '@core/ui/forms/checkbox/hooks/useCheckbox';
import type { CheckboxProps } from '@src-types/ui/forms';

/**
 * Checkbox - Reusable checkbox component with label, error, and helper text support
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Controlled and uncontrolled modes
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="I agree to the terms"
 *   required
 *   error={errors.agreement}
 *   helperText="Please read our terms"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Subscribe to newsletter"
 *   checked={isSubscribed}
 *   onChange={(e) => setIsSubscribed(e.target.checked)}
 *   size="lg"
 * />
 * ```
 */
export default function Checkbox(props: Readonly<CheckboxProps>) {
	const { contentProps } = useCheckboxProps({ props });
	return <CheckboxContent {...contentProps} />;
}
