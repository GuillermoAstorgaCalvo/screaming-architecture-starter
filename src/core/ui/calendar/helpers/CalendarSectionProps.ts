import type {
	CalendarGridSectionProps,
	CalendarHeaderSectionProps,
	CalendarViewSectionProps,
} from '@core/ui/calendar/types/CalendarViewTypes';

import { getCalendarContainerProps } from './CalendarViewHelpers';

function extractRestProps(calendarProps: CalendarViewSectionProps['calendarProps']) {
	const {
		month: _month,
		defaultMonth: _defaultMonth,
		selectedDate: _selectedDate,
		defaultSelectedDate: _defaultSelectedDate,
		selectedRange: _selectedRange,
		defaultSelectedRange: _defaultSelectedRange,
		minDate: _minDate,
		maxDate: _maxDate,
		events: _events,
		selectable: _selectable,
		rangeSelectable: _rangeSelectable,
		onMonthChange: _onMonthChange,
		onDateSelect: _onDateSelect,
		onRangeSelect: _onRangeSelect,
		renderDay: _renderDay,
		renderEvent: _renderEvent,
		showWeekNumbers: _showWeekNumbers,
		locale: _locale,
		firstDayOfWeek: _firstDayOfWeek,
		showNavigation: _showNavigation,
		headerContent: _headerContent,
		...restProps
	} = calendarProps;
	return restProps;
}

/** Build the container props for the Calendar view section */
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
		...extractRestProps(calendarProps),
	});
}

/** Build the header props for the Calendar view section */
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

/** Build the grid props for the Calendar view section */
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

/** Prepare props for calendar sections */
export function prepareCalendarSectionProps(props: Readonly<CalendarViewSectionProps>) {
	return {
		container: getSectionContainerProps(props),
		header: getSectionHeaderProps(props),
		grid: getSectionGridProps(props),
	};
}
