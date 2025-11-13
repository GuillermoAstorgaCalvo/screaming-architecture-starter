import { isSameDay } from '@core/ui/calendar/helpers/CalendarHelpers';
import type { SingleSelectionParams } from '@core/ui/calendar/types/CalendarHandlersTypes';

/**
 * Handles single date selection logic for calendar
 */
export function handleSingleSelection(params: SingleSelectionParams): void {
	const { date, selectedDate, setInternalSelectedDate, onDateSelect } = params;
	const newSelectedDate = isSameDay(date, selectedDate) ? null : date;
	setInternalSelectedDate(newSelectedDate);
	onDateSelect?.(newSelectedDate);
}

/**
 * Builds parameters for single selection handler
 */
export function buildSingleSelectionParams(params: SingleSelectionParams): SingleSelectionParams {
	const { date, selectedDate, setInternalSelectedDate, onDateSelect } = params;
	return {
		date,
		selectedDate,
		setInternalSelectedDate,
		...(onDateSelect && { onDateSelect }),
	};
}
