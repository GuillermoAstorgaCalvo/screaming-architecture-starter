import type { DateRangePickerProps } from '@src-types/ui/forms-dates';

import { DateRangePickerContent } from './DateRangePickerContent';
import { useDateRangePickerProps } from './useDateRangePicker';

/**
 * DateRangePicker - Reusable date range input component with label, error, and helper text support
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Controlled and uncontrolled modes
 * - Min and max date support for both start and end dates
 * - Separate labels for start and end dates
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   label="Date Range"
 *   startValue={startDate}
 *   endValue={endDate}
 *   onStartChange={(e) => setStartDate(e.target.value)}
 *   onEndChange={(e) => setEndDate(e.target.value)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   label="Booking Period"
 *   startLabel="Check-in"
 *   endLabel="Check-out"
 *   startMin="2024-01-01"
 *   endMin={startDate}
 *   helperText="Select your booking dates"
 * />
 * ```
 */
export default function DateRangePicker(props: Readonly<DateRangePickerProps>) {
	const { contentProps } = useDateRangePickerProps({ props });
	return <DateRangePickerContent {...contentProps} />;
}
