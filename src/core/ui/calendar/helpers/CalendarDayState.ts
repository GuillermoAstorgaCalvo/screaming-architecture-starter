import {
	getEventsForDate,
	isDateDisabled,
	isDateInRange,
	isRangeEnd,
	isRangeStart,
	isSameDay,
} from '@core/ui/calendar/helpers/CalendarHelpers';
import type {
	DayState,
	DayStateOptions,
	SelectionStateOptions,
} from '@core/ui/calendar/types/CalendarGridTypes';
import type { CalendarEvent } from '@src-types/ui/data/calendar';

/**
 * Calculate selection state for a day
 */
export function calculateSelectionState(options: Readonly<SelectionStateOptions>) {
	return {
		dayIsSelected: isDaySelected(options),
		dayIsInRange: isDayInSelectedRange(options),
		dayIsRangeStart: isDayRangeBoundary(options, 'start'),
		dayIsRangeEnd: isDayRangeBoundary(options, 'end'),
	};
}

function isDayInCurrentMonth(day: Date, displayMonth: Date): boolean {
	return day.getMonth() === displayMonth.getMonth();
}

function resolveDayEvents(day: Date, events: DayStateOptions['events']): CalendarEvent[] {
	return getEventsForDate(day, events) as CalendarEvent[];
}

function resolveDisabledState(
	options: Pick<Readonly<DayStateOptions>, 'day' | 'minDate' | 'maxDate' | 'disabled'>
): boolean {
	const { day, minDate, maxDate, disabled } = options;
	return disabled || isDateDisabled(day, minDate, maxDate);
}

function isDaySelected(options: Readonly<SelectionStateOptions>): boolean {
	const { day, selectable, selectedDate } = options;
	return Boolean(selectable && selectedDate && isSameDay(day, selectedDate));
}

function isDayInSelectedRange(options: Readonly<SelectionStateOptions>): boolean {
	const { day, rangeSelectable, rangeStart, rangeEnd } = options;
	if (!rangeSelectable || !rangeStart || !rangeEnd) {
		return false;
	}

	return isDateInRange(day, { start: rangeStart, end: rangeEnd });
}

function isDayRangeBoundary(
	options: Readonly<SelectionStateOptions>,
	position: 'start' | 'end'
): boolean {
	const { day, rangeSelectable, rangeStart, rangeEnd } = options;
	if (!rangeSelectable) {
		return false;
	}

	if (position === 'start' && rangeStart) {
		return isRangeStart(day, { start: rangeStart, end: rangeEnd });
	}

	if (position === 'end' && rangeEnd) {
		return isRangeEnd(day, { start: rangeStart, end: rangeEnd });
	}

	return false;
}

/**
 * Calculate day state for a given date
 */
export function calculateDayState(options: Readonly<DayStateOptions>): DayState {
	const isCurrentMonth = isDayInCurrentMonth(options.day, options.displayMonth);
	const dayEvents = resolveDayEvents(options.day, options.events);
	const selectionState = calculateSelectionState(options);
	const dayIsDisabled = resolveDisabledState(options);

	return {
		isCurrentMonth,
		dayEvents,
		...selectionState,
		dayIsDisabled,
	};
}
