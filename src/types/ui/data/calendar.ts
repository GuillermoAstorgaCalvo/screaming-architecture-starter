import type { DateLike } from '@src-types/datetime';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Calendar event
 */
export interface CalendarEvent {
	/** Unique identifier for the event */
	id: string;
	/** Event date */
	date: DateLike;
	/** Event title/label */
	title: string;
	/** Optional event description */
	description?: string;
	/** Optional event color/variant */
	color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
	/** Optional custom className for the event */
	className?: string;
}

/**
 * Calendar component props
 */
export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Currently displayed month (Date object) */
	month?: DateLike;
	/** Default month to display (uncontrolled) */
	defaultMonth?: DateLike;
	/** Selected date (controlled) */
	selectedDate?: DateLike;
	/** Default selected date (uncontrolled) */
	defaultSelectedDate?: DateLike;
	/** Selected date range (controlled) */
	selectedRange?: { start: DateLike; end: DateLike };
	/** Default selected date range (uncontrolled) */
	defaultSelectedRange?: { start: DateLike; end: DateLike };
	/** Minimum selectable date */
	minDate?: DateLike;
	/** Maximum selectable date */
	maxDate?: DateLike;
	/** Events to display on the calendar */
	events?: CalendarEvent[];
	/** Whether to allow date selection @default false */
	selectable?: boolean;
	/** Whether to allow range selection @default false */
	rangeSelectable?: boolean;
	/** Callback when month changes */
	onMonthChange?: (month: Date) => void;
	/** Callback when date is selected (single selection) */
	onDateSelect?: (date: Date | null) => void;
	/** Callback when date range is selected */
	onRangeSelect?: (range: { start: Date | null; end: Date | null }) => void;
	/** Custom renderer for day cells */
	renderDay?: (props: {
		date: Date;
		isCurrentMonth: boolean;
		isToday: boolean;
		isSelected?: boolean;
		isInRange?: boolean;
		isRangeStart?: boolean;
		isRangeEnd?: boolean;
		events?: CalendarEvent[];
		disabled?: boolean;
		onClick?: (date: Date) => void;
	}) => ReactNode;
	/** Custom renderer for event badges */
	renderEvent?: (event: CalendarEvent) => ReactNode;
	/** Whether to show week numbers @default false */
	showWeekNumbers?: boolean;
	/** Locale for date formatting @default 'en-US' */
	locale?: string;
	/** First day of week (0 = Sunday, 1 = Monday, etc.) @default 0 */
	firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // eslint-disable-line no-magic-numbers
	/** Whether to show navigation buttons @default true */
	showNavigation?: boolean;
	/** Custom header content */
	headerContent?: ReactNode;
	/** Whether the calendar is disabled @default false */
	disabled?: boolean;
	/** ID for the calendar element */
	calendarId?: string;
}
