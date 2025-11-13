import { RadioContent } from '@core/ui/forms/radio/components/RadioParts';
import { useRadioProps } from '@core/ui/forms/radio/hooks/useRadio';
import type { RadioProps } from '@src-types/ui/forms';

/**
 * Radio - Reusable radio button component with label, error, and helper text support
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Controlled and uncontrolled modes
 * - Radio group support via name attribute
 *
 * @example
 * ```tsx
 * <Radio
 *   name="gender"
 *   value="male"
 *   label="Male"
 *   required
 *   error={errors.gender}
 *   helperText="Please select your gender"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Radio
 *   name="theme"
 *   value="dark"
 *   label="Dark mode"
 *   checked={theme === 'dark'}
 *   onChange={(e) => setTheme(e.target.value)}
 *   size="lg"
 * />
 * ```
 */
export default function Radio(props: Readonly<RadioProps>) {
	const { contentProps } = useRadioProps({ props });
	return <RadioContent {...contentProps} />;
}
