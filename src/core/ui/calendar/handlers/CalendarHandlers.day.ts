import {
	buildRangeSelectionParams,
	handleRangeSelection,
} from '@core/ui/calendar/handlers/CalendarHandlers.range';
import {
	buildSingleSelectionParams,
	handleSingleSelection,
} from '@core/ui/calendar/handlers/CalendarHandlers.single';
import { isDateDisabled } from '@core/ui/calendar/helpers/CalendarHelpers';
import type { DayClickHandlerParams } from '@core/ui/calendar/types/CalendarHandlersTypes';

/**
 * Creates handler for day click events
 */
function createHandleDayClick(params: DayClickHandlerParams): (date: Date) => void {
	return (date: Date) => {
		const { disabled, selectable, rangeSelectable, minDate, maxDate } = params;

		if (disabled || isDateDisabled(date, minDate, maxDate)) return;

		if (rangeSelectable) {
			handleRangeSelection(buildRangeSelectionParams({ ...params, date }));
		} else if (selectable) {
			handleSingleSelection(buildSingleSelectionParams({ ...params, date }));
		}
	};
}

/**
 * Builds day click handler with proper parameter handling
 */
export function buildDayClickHandler(params: DayClickHandlerParams): (date: Date) => void {
	const { minDate, maxDate, onDateSelect, onRangeSelect, ...rest } = params;
	return createHandleDayClick({
		...rest,
		...(minDate !== undefined && { minDate }),
		...(maxDate !== undefined && { maxDate }),
		...(onDateSelect && { onDateSelect }),
		...(onRangeSelect && { onRangeSelect }),
	});
}
