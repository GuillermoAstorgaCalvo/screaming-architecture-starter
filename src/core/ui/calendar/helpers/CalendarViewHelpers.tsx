import { CalendarGrid } from '@core/ui/calendar/components/CalendarGrid';
import { CalendarHeader } from '@core/ui/calendar/components/CalendarHeader';
import { formatMonthYear } from '@core/ui/calendar/helpers/CalendarHelpers';
import type {
	CalendarContainerProps,
	CalendarGridSectionProps,
	CalendarHeaderSectionProps,
	CalendarViewSectionProps,
} from '@core/ui/calendar/types/CalendarViewTypes';

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
export function prepareCalendarSectionProps(props: Readonly<CalendarViewSectionProps>) {
	return {
		container: getSectionContainerProps(props),
		header: getSectionHeaderProps(props),
		grid: getSectionGridProps(props),
	};
}

/**
 * Build the container props for the Calendar view section
 */
export function getSectionContainerProps({
	state,
	opts,
	calendarProps,
}: Readonly<CalendarViewSectionProps>) {
	return getCalendarContainerProps({
		calendarId: state.calendarIdValue,
		displayMonth: state.displayMonth,
		locale: opts.locale,
		className: calendarProps.className,
		...calendarProps,
	});
}

/**
 * Build the header props for the Calendar view section
 */
export function getSectionHeaderProps({
	state,
	handlers,
	opts,
	calendarProps,
}: Readonly<CalendarViewSectionProps>): CalendarHeaderSectionProps {
	return {
		displayMonth: state.displayMonth,
		locale: opts.locale,
		showNavigation: calendarProps.showNavigation ?? true,
		disabled: opts.disabled,
		headerContent: calendarProps.headerContent,
		onPreviousMonth: handlers.handlePreviousMonth,
		onNextMonth: handlers.handleNextMonth,
		onToday: handlers.handleToday,
	};
}

/**
 * Build the grid props for the Calendar view section
 */
export function getSectionGridProps({
	state,
	handlers,
	opts,
	minDate,
	maxDate,
	calendarProps,
}: Readonly<CalendarViewSectionProps>): CalendarGridSectionProps {
	return {
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
	};
}
