import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { formatMonthYear } from './CalendarHelpers';
import type {
	CalendarContainerProps,
	CalendarGridSectionProps,
	CalendarHeaderSectionProps,
	CalendarViewSectionProps,
} from './CalendarViewTypes';

/**
 * Get container div props for the calendar
 */
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

/**
 * Render the calendar header section
 */
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

/**
 * Render the calendar grid section
 */
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

/**
 * Prepare props for calendar sections
 */
export function prepareCalendarSectionProps({
	state,
	handlers,
	opts,
	minDate,
	maxDate,
	calendarProps,
}: Readonly<CalendarViewSectionProps>) {
	return {
		container: getCalendarContainerProps({
			calendarId: state.calendarIdValue,
			displayMonth: state.displayMonth,
			locale: opts.locale,
			className: calendarProps.className,
			...calendarProps,
		}),
		header: {
			displayMonth: state.displayMonth,
			locale: opts.locale,
			showNavigation: calendarProps.showNavigation ?? true,
			disabled: opts.disabled,
			headerContent: calendarProps.headerContent,
			onPreviousMonth: handlers.handlePreviousMonth,
			onNextMonth: handlers.handleNextMonth,
			onToday: handlers.handleToday,
		},
		grid: {
			state,
			showWeekNumbers: calendarProps.showWeekNumbers ?? false,
			events: calendarProps.events,
			selectable: opts.selectable,
			rangeSelectable: opts.rangeSelectable,
			minDate,
			maxDate,
			disabled: opts.disabled,
			onDayClick: handlers.handleDayClick,
			renderDay: calendarProps.renderDay,
		},
	};
}
