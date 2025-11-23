import { CalendarGrid } from '@core/ui/calendar/components/CalendarGrid';
import { CalendarHeader } from '@core/ui/calendar/components/CalendarHeader';
import { formatMonthYear } from '@core/ui/calendar/helpers/CalendarHelpers';
import type {
	CalendarContainerProps,
	CalendarGridSectionProps,
	CalendarHeaderSectionProps,
} from '@core/ui/calendar/types/CalendarViewTypes';

/** Get container div props for the calendar */
export function getCalendarContainerProps({
	calendarId,
	displayMonth,
	locale,
	className,
	...rest
}: Readonly<CalendarContainerProps>) {
	return {
		id: calendarId,
		className: `flex flex-col ${className ?? ''}`,
		role: 'grid' as const,
		'aria-label': `Calendar for ${formatMonthYear(displayMonth, locale)}`,
		...rest,
	};
}

/** Render the calendar header section */
export function renderCalendarHeader({
	displayMonth,
	locale,
	showNavigation,
	disabled,
	headerContent,
	onPreviousMonth,
	onNextMonth,
	onToday,
}: Readonly<CalendarHeaderSectionProps>) {
	return (
		<CalendarHeader
			displayMonth={displayMonth}
			locale={locale}
			showNavigation={showNavigation}
			disabled={disabled}
			headerContent={headerContent}
			onPreviousMonth={onPreviousMonth}
			onNextMonth={onNextMonth}
			onToday={onToday}
		/>
	);
}

/** Render the calendar grid section */
export function renderCalendarGrid({
	state,
	showWeekNumbers,
	events,
	selectable,
	rangeSelectable,
	minDate,
	maxDate,
	disabled,
	onDayClick,
	renderDay,
}: Readonly<CalendarGridSectionProps>) {
	return (
		<CalendarGrid
			{...state}
			showWeekNumbers={showWeekNumbers}
			events={events}
			selectable={selectable}
			rangeSelectable={rangeSelectable}
			minDate={minDate}
			maxDate={maxDate}
			disabled={disabled}
			onDayClick={onDayClick}
			renderDay={renderDay}
		/>
	);
}
