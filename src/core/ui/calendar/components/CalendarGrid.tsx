import {
	renderCalendarWeeks,
	renderWeekdayHeaders,
} from '@core/ui/calendar/helpers/CalendarGridHelpers';
import type { WeekRowOptions } from '@core/ui/calendar/types/CalendarGridTypes';
import type { CalendarEvent, CalendarProps } from '@src-types/ui/data/calendar';

interface CalendarGridProps {
	weeks: Date[][];
	displayMonth: Date;
	weekdayNames: string[];
	showWeekNumbers: boolean;
	events?: CalendarEvent[] | undefined;
	selectable: boolean;
	rangeSelectable: boolean;
	selectedDate: Date | null;
	rangeStart: Date | null;
	rangeEnd: Date | null;
	minDate?: Date | undefined;
	maxDate?: Date | undefined;
	disabled: boolean;
	onDayClick: (date: Date) => void;
	renderDay?: CalendarProps['renderDay'];
}

export function CalendarGrid(props: Readonly<CalendarGridProps>) {
	const {
		weeks,
		weekdayNames,
		showWeekNumbers,
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
		onDayClick,
		renderDay,
	} = props;
	const weekRowOptions: Omit<WeekRowOptions, 'week' | 'weekIndex'> = {
		displayMonth,
		showWeekNumbers,
		events,
		selectable,
		selectedDate,
		rangeSelectable,
		rangeStart,
		rangeEnd,
		minDate,
		maxDate,
		disabled,
		onDayClick,
		renderDay,
	};

	return (
		<div className="border rounded-lg overflow-hidden">
			{renderWeekdayHeaders(weekdayNames, showWeekNumbers)}
			{renderCalendarWeeks(weeks, weekRowOptions)}
		</div>
	);
}
