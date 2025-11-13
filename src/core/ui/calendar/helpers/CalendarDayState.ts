import type { CalendarEvent } from '@src-types/ui/data/calendar';

import type { DayState, DayStateOptions, SelectionStateOptions } from './CalendarGridTypes';
import {
	getEventsForDate,
	isDateDisabled,
	isDateInRange,
	isRangeEnd,
	isRangeStart,
	isSameDay,
} from './CalendarHelpers';

/**
 * Calculate selection state for a day
 */
export function calculateSelectionState(options: Readonly<SelectionStateOptions>) {
	const { day, selectable, selectedDate, rangeSelectable, rangeStart, rangeEnd } = options;
	const dayIsSelected = selectable && selectedDate ? isSameDay(day, selectedDate) : false;
	const dayIsInRange =
		rangeSelectable && rangeStart && rangeEnd
			? isDateInRange(day, { start: rangeStart, end: rangeEnd })
			: false;
	const dayIsRangeStart =
		rangeSelectable && rangeStart ? isRangeStart(day, { start: rangeStart, end: rangeEnd }) : false;
	const dayIsRangeEnd =
		rangeSelectable && rangeEnd ? isRangeEnd(day, { start: rangeStart, end: rangeEnd }) : false;

	return { dayIsSelected, dayIsInRange, dayIsRangeStart, dayIsRangeEnd };
}

/**
 * Calculate day state for a given date
 */
export function calculateDayState(options: Readonly<DayStateOptions>): DayState {
	const {
		day,
		displayMonth,
		events,
		selectable,
		selectedDate,
		rangeSelectable,
		rangeStart,
		rangeEnd,
		minDate,
		maxDate,
		disabled,
	} = options;
	const isCurrentMonth = day.getMonth() === displayMonth.getMonth();
	const dayEvents = getEventsForDate(day, events) as CalendarEvent[];
	const selectionState = calculateSelectionState({
		day,
		selectable,
		selectedDate,
		rangeSelectable,
		rangeStart,
		rangeEnd,
	});
	const dayIsDisabled = disabled || isDateDisabled(day, minDate, maxDate);

	return {
		isCurrentMonth,
		dayEvents,
		...selectionState,
		dayIsDisabled,
	};
}
