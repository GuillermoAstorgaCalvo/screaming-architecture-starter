import { useId } from 'react';

import {
	generateDateRangePickerId,
	generateEndDatePickerId,
	generateStartDatePickerId,
	getAriaDescribedBy,
	getDateRangePickerClasses,
} from './DateRangePickerHelpers';
import type {
	UseDateRangePickerStateOptions,
	UseDateRangePickerStateReturn,
} from './useDateRangePicker.types';

/**
 * Hook to compute date range picker state (ID, ARIA attributes, and classes)
 */
export function useDateRangePickerState({
	dateRangePickerId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseDateRangePickerStateOptions>): UseDateRangePickerStateReturn {
	const generatedId = useId();
	const finalId = generateDateRangePickerId(generatedId, dateRangePickerId, label);
	const startId = generateStartDatePickerId(finalId);
	const endId = generateEndDatePickerId(finalId);

	const startAriaDescribedBy = startId ? getAriaDescribedBy(startId, error, helperText) : undefined;
	const endAriaDescribedBy = endId ? getAriaDescribedBy(endId, error, helperText) : undefined;

	const datePickerClasses = getDateRangePickerClasses({
		size,
		className,
	});

	return {
		finalId,
		startDatePickerClasses: datePickerClasses,
		endDatePickerClasses: datePickerClasses,
		startAriaDescribedBy,
		endAriaDescribedBy,
	};
}
