import type { CalendarProps } from '@src-types/ui/data/calendar';
import { useId, useMemo, useState } from 'react';

import { getCalendarDays, getWeekdayNames, toDate } from './CalendarHelpers';

const DAYS_IN_WEEK = 7;

function getDisplayMonth(currentMonth: Date): Date {
	return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
}

function groupDaysIntoWeeks(calendarDays: Date[]): Date[][] {
	const weekGroups: Date[][] = [];
	for (let i = 0; i < calendarDays.length; i += DAYS_IN_WEEK) {
		weekGroups.push(calendarDays.slice(i, i + DAYS_IN_WEEK));
	}
	return weekGroups;
}

function useCalendarId(calendarId?: string): string {
	const generatedId = useId();
	return calendarId ?? `calendar-${generatedId}`;
}

interface MonthStateResult {
	displayMonth: Date;
	setInternalMonth: (date: Date) => void;
}

function useMonthState(
	controlledMonth: CalendarProps['month'],
	defaultMonth: CalendarProps['defaultMonth']
): MonthStateResult {
	const [internalMonth, setInternalMonth] = useState<Date>(() => {
		const initialMonth = toDate(controlledMonth ?? defaultMonth) ?? new Date();
		return new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1);
	});

	const currentMonth = controlledMonth ? (toDate(controlledMonth) ?? internalMonth) : internalMonth;
	const displayMonth = useMemo(() => getDisplayMonth(currentMonth), [currentMonth]);

	return { displayMonth, setInternalMonth };
}

interface SelectionStateParams {
	controlledSelectedDate: CalendarProps['selectedDate'];
	defaultSelectedDate: CalendarProps['defaultSelectedDate'];
	controlledSelectedRange: CalendarProps['selectedRange'];
	defaultSelectedRange: CalendarProps['defaultSelectedRange'];
}

interface SelectionStateResult {
	selectedDate: Date | null;
	rangeStart: Date | null;
	rangeEnd: Date | null;
	setInternalSelectedDate: (date: Date | null) => void;
	setInternalRangeStart: (date: Date | null) => void;
	setInternalRangeEnd: (date: Date | null) => void;
}

function useSelectionState(params: SelectionStateParams): SelectionStateResult {
	const {
		controlledSelectedDate,
		defaultSelectedDate,
		controlledSelectedRange,
		defaultSelectedRange,
	} = params;
	const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(() =>
		toDate(controlledSelectedDate ?? defaultSelectedDate)
	);
	const [internalRangeStart, setInternalRangeStart] = useState<Date | null>(() =>
		toDate(controlledSelectedRange?.start ?? defaultSelectedRange?.start)
	);
	const [internalRangeEnd, setInternalRangeEnd] = useState<Date | null>(() =>
		toDate(controlledSelectedRange?.end ?? defaultSelectedRange?.end)
	);

	const selectedDate = controlledSelectedDate
		? toDate(controlledSelectedDate)
		: internalSelectedDate;
	const rangeStart = controlledSelectedRange
		? toDate(controlledSelectedRange.start)
		: internalRangeStart;
	const rangeEnd = controlledSelectedRange ? toDate(controlledSelectedRange.end) : internalRangeEnd;

	return {
		selectedDate,
		rangeStart,
		rangeEnd,
		setInternalSelectedDate,
		setInternalRangeStart,
		setInternalRangeEnd,
	};
}

interface CalendarComputedResult {
	calendarDays: Date[];
	weekdayNames: string[];
	weeks: Date[][];
}

function useCalendarComputed(
	displayMonth: Date,
	firstDayOfWeek: number,
	locale: string
): CalendarComputedResult {
	const calendarDays = useMemo(
		() => getCalendarDays(displayMonth, firstDayOfWeek),
		[displayMonth, firstDayOfWeek]
	);

	const weekdayNames = useMemo(
		() => getWeekdayNames(locale, firstDayOfWeek),
		[locale, firstDayOfWeek]
	);

	const weeks = useMemo(() => groupDaysIntoWeeks(calendarDays), [calendarDays]);

	return { calendarDays, weekdayNames, weeks };
}

export function useCalendarState(props: Readonly<CalendarProps>) {
	const {
		month: controlledMonth,
		defaultMonth,
		selectedDate: controlledSelectedDate,
		defaultSelectedDate,
		selectedRange: controlledSelectedRange,
		defaultSelectedRange,
		firstDayOfWeek = 0,
		locale = 'en-US',
		calendarId,
	} = props;

	const calendarIdValue = useCalendarId(calendarId);
	const { displayMonth, setInternalMonth } = useMonthState(controlledMonth, defaultMonth);
	const selectionState = useSelectionState({
		controlledSelectedDate,
		defaultSelectedDate,
		controlledSelectedRange,
		defaultSelectedRange,
	});
	const { weekdayNames, weeks } = useCalendarComputed(displayMonth, firstDayOfWeek, locale);

	return {
		calendarIdValue,
		displayMonth,
		selectedDate: selectionState.selectedDate,
		rangeStart: selectionState.rangeStart,
		rangeEnd: selectionState.rangeEnd,
		weekdayNames,
		weeks,
		setInternalMonth,
		setInternalSelectedDate: selectionState.setInternalSelectedDate,
		setInternalRangeStart: selectionState.setInternalRangeStart,
		setInternalRangeEnd: selectionState.setInternalRangeEnd,
	};
}
