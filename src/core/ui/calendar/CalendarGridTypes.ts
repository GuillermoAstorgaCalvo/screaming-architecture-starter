import type { CalendarEvent, CalendarProps } from '@src-types/ui/data/calendar';
import type { ReactNode } from 'react';

export interface DayState {
	isCurrentMonth: boolean;
	dayEvents: CalendarEvent[];
	dayIsSelected: boolean;
	dayIsInRange: boolean;
	dayIsRangeStart: boolean;
	dayIsRangeEnd: boolean;
	dayIsDisabled: boolean;
}

export interface DayStateOptions {
	day: Date;
	displayMonth: Date;
	events: CalendarEvent[] | undefined;
	selectable: boolean;
	selectedDate: Date | null;
	rangeSelectable: boolean;
	rangeStart: Date | null;
	rangeEnd: Date | null;
	minDate: Date | undefined;
	maxDate: Date | undefined;
	disabled: boolean;
}

export interface SelectionStateOptions {
	day: Date;
	selectable: boolean;
	selectedDate: Date | null;
	rangeSelectable: boolean;
	rangeStart: Date | null;
	rangeEnd: Date | null;
}

export interface WeekRowOptions {
	week: Date[];
	weekIndex: number;
	displayMonth: Date;
	showWeekNumbers: boolean;
	events: CalendarEvent[] | undefined;
	selectable: boolean;
	selectedDate: Date | null;
	rangeSelectable: boolean;
	rangeStart: Date | null;
	rangeEnd: Date | null;
	minDate: Date | undefined;
	maxDate: Date | undefined;
	disabled: boolean;
	onDayClick: (date: Date) => void;
	renderDay?: CalendarProps['renderDay'];
}

export interface DayCellOptions {
	day: Date;
	dayState: DayState;
	onDayClick: (date: Date) => void;
	renderDay?: CalendarProps['renderDay'];
}

export interface WeekMetadata {
	weekKey: number;
	weekNumber: number;
}

export type DayCellsOptions = Omit<DayStateOptions, 'day'> & {
	week: Date[];
	onDayClick: (date: Date) => void;
	renderDay?: CalendarProps['renderDay'];
};

export interface WeekRowContainerOptions {
	weekKey: number;
	showWeekNumbers: boolean;
	weekNumber: number;
	dayCells: ReactNode[];
}
