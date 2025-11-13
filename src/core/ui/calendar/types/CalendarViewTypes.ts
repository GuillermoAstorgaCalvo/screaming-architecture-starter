import type { CalendarEvent, CalendarProps } from '@src-types/ui/data/calendar';
import type { ReactNode } from 'react';

export interface CalendarState {
	calendarIdValue: string;
	displayMonth: Date;
	selectedDate: Date | null;
	rangeStart: Date | null;
	rangeEnd: Date | null;
	weekdayNames: string[];
	weeks: Date[][];
	setInternalMonth: (date: Date) => void;
	setInternalSelectedDate: (date: Date | null) => void;
	setInternalRangeStart: (date: Date | null) => void;
	setInternalRangeEnd: (date: Date | null) => void;
}

export interface CalendarHandlers {
	handlePreviousMonth: () => void;
	handleNextMonth: () => void;
	handleToday: () => void;
	handleDayClick: (date: Date) => void;
}

export interface CalendarViewProps {
	state: CalendarState;
	handlers: CalendarHandlers;
	opts: { selectable: boolean; rangeSelectable: boolean; disabled: boolean; locale: string };
	minDate?: Date | undefined;
	maxDate?: Date | undefined;
	props: Readonly<CalendarProps>;
}

export interface CalendarContainerProps {
	calendarId: string;
	displayMonth: Date;
	locale: string;
	className?: string | undefined;
	[key: string]: unknown;
}

export interface CalendarHeaderSectionProps {
	displayMonth: Date;
	locale: string;
	showNavigation: boolean;
	disabled: boolean;
	headerContent?: ReactNode;
	onPreviousMonth: () => void;
	onNextMonth: () => void;
	onToday: () => void;
}

export interface CalendarGridSectionProps {
	state: CalendarState;
	showWeekNumbers: boolean;
	events?: CalendarEvent[] | undefined;
	selectable: boolean;
	rangeSelectable: boolean;
	minDate?: Date | undefined;
	maxDate?: Date | undefined;
	disabled: boolean;
	onDayClick: (date: Date) => void;
	renderDay?: CalendarProps['renderDay'];
}

export interface CalendarViewSectionProps {
	state: CalendarState;
	handlers: CalendarHandlers;
	opts: { selectable: boolean; rangeSelectable: boolean; disabled: boolean; locale: string };
	minDate?: Date | undefined;
	maxDate?: Date | undefined;
	calendarProps: Readonly<CalendarProps>;
}
