import {
	prepareCalendarSectionProps,
	renderCalendarGrid,
	renderCalendarHeader,
} from '@core/ui/calendar/helpers/CalendarViewHelpers';
import type { CalendarViewProps } from '@core/ui/calendar/types/CalendarViewTypes';

/**
 * CalendarView - Main calendar view component that orchestrates header and grid
 *
 * This component prepares and renders the calendar's container, header, and grid sections.
 * It delegates to helper functions for prop preparation and rendering logic.
 */
export function CalendarView({
	state,
	handlers,
	opts,
	minDate,
	maxDate,
	props: calendarProps,
}: Readonly<CalendarViewProps>) {
	const { container, header, grid } = prepareCalendarSectionProps({
		state,
		handlers,
		opts,
		minDate,
		maxDate,
		calendarProps,
	});

	return (
		<div {...container}>
			{renderCalendarHeader(header)}
			{renderCalendarGrid(grid)}
		</div>
	);
}
