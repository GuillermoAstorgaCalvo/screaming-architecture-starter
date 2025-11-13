import type { CalendarEvent } from '@src-types/ui/data/calendar';
import type { ReactNode } from 'react';

/**
 * Calendar day cell props
 */
export interface CalendarDayProps {
	/** Date for this day */
	date: Date;
	/** Whether this day is in the current month */
	isCurrentMonth: boolean;
	/** Whether this day is today */
	isToday: boolean;
	/** Whether this day is selected */
	isSelected?: boolean;
	/** Whether this day is in a selected range */
	isInRange?: boolean;
	/** Whether this day is the start of a range */
	isRangeStart?: boolean;
	/** Whether this day is the end of a range */
	isRangeEnd?: boolean;
	/** Events on this day */
	events?: CalendarEvent[];
	/** Whether this day is disabled */
	disabled?: boolean;
	/** Click handler for the day */
	onClick?: (date: Date) => void;
	/** Custom renderer for day content */
	renderDay?: (props: CalendarDayProps) => ReactNode;
}
