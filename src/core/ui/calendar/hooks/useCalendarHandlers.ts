import { buildDayClickHandler } from '@core/ui/calendar/handlers/CalendarHandlers.day';
import { buildMonthHandlers } from '@core/ui/calendar/handlers/CalendarHandlers.month';
import type {
	CalendarHandlers,
	UseCalendarHandlersParams,
} from '@core/ui/calendar/types/CalendarHandlersTypes';

/**
 * Builds all calendar handlers (month navigation and day click)
 */
function buildAllHandlers(params: UseCalendarHandlersParams): CalendarHandlers {
	const {
		displayMonth,
		setInternalMonth,
		onMonthChange,
		onDateSelect,
		onRangeSelect,
		minDate,
		maxDate,
		...dayClickParams
	} = params;

	const monthHandlers = buildMonthHandlers({
		displayMonth,
		setInternalMonth,
		...(onMonthChange && { onMonthChange }),
	});

	const handleDayClick = buildDayClickHandler({
		...dayClickParams,
		...(minDate !== undefined && { minDate }),
		...(maxDate !== undefined && { maxDate }),
		...(onDateSelect && { onDateSelect }),
		...(onRangeSelect && { onRangeSelect }),
	});

	return { ...monthHandlers, handleDayClick };
}

/**
 * Hook that provides calendar event handlers
 */
export function useCalendarHandlers(params: UseCalendarHandlersParams): CalendarHandlers {
	return buildAllHandlers(params);
}
