import type { TimePickerProps } from '@src-types/ui/forms-dates';

import { TimePickerContent } from './TimePickerContent';
import { useTimePickerProps } from './useTimePicker';

/**
 * TimePicker - Reusable time input component with label, error, and helper text support
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Controlled and uncontrolled modes
 * - Min and max time support
 *
 * @example
 * ```tsx
 * <TimePicker
 *   label="Select Time"
 *   value={time}
 *   onChange={(e) => setTime(e.target.value)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <TimePicker
 *   label="Start Time"
 *   min="09:00"
 *   max="17:00"
 *   helperText="Select a time between 9 AM and 5 PM"
 * />
 * ```
 */
export default function TimePicker(props: Readonly<TimePickerProps>) {
	const { contentProps } = useTimePickerProps({ props });
	return <TimePickerContent {...contentProps} />;
}
