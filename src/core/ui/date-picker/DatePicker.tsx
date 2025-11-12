import type { DatePickerProps } from '@src-types/ui/forms-dates';

import { DatePickerContent } from './DatePickerContent';
import { useDatePickerProps } from './useDatePicker';

/**
 * DatePicker - Reusable date input component with label, error, and helper text support
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Controlled and uncontrolled modes
 * - Min and max date support
 *
 * @example
 * ```tsx
 * <DatePicker
 *   label="Select Date"
 *   value={date}
 *   onChange={(e) => setDate(e.target.value)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <DatePicker
 *   label="Birth Date"
 *   min="1900-01-01"
 *   max="2024-12-31"
 *   helperText="Select your birth date"
 * />
 * ```
 */
export default function DatePicker(props: Readonly<DatePickerProps>) {
	const { contentProps } = useDatePickerProps({ props });
	return <DatePickerContent {...contentProps} />;
}
