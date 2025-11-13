/**
 * Parameters for calendar handlers hook
 */
export interface UseCalendarHandlersParams {
	displayMonth: Date;
	selectedDate: Date | null;
	rangeStart: Date | null;
	rangeEnd: Date | null;
	selectable: boolean;
	rangeSelectable: boolean;
	disabled: boolean;
	minDate?: Date | undefined;
	maxDate?: Date | undefined;
	onMonthChange?: ((month: Date) => void) | undefined;
	onDateSelect?: ((date: Date | null) => void) | undefined;
	onRangeSelect?: ((range: { start: Date | null; end: Date | null }) => void) | undefined;
	setInternalMonth: (month: Date) => void;
	setInternalSelectedDate: (date: Date | null) => void;
	setInternalRangeStart: (date: Date | null) => void;
	setInternalRangeEnd: (date: Date | null) => void;
}

/**
 * Parameters for range selection handler
 */
export interface RangeSelectionParams {
	date: Date;
	rangeStart: Date | null;
	rangeEnd: Date | null;
	setInternalRangeStart: (date: Date | null) => void;
	setInternalRangeEnd: (date: Date | null) => void;
	onRangeSelect?: (range: { start: Date | null; end: Date | null }) => void;
}

/**
 * Parameters for single selection handler
 */
export interface SingleSelectionParams {
	date: Date;
	selectedDate: Date | null;
	setInternalSelectedDate: (date: Date | null) => void;
	onDateSelect?: (date: Date | null) => void;
}

/**
 * Parameters for month change handler
 */
export interface MonthChangeParams {
	newMonth: Date;
	setInternalMonth: (month: Date) => void;
	onMonthChange?: (month: Date) => void;
}

/**
 * Parameters for month navigation handlers
 */
export interface MonthNavigationParams {
	displayMonth: Date;
	setInternalMonth: (month: Date) => void;
	onMonthChange?: (month: Date) => void;
}

/**
 * Parameters for day click handler
 */
export interface DayClickHandlerParams {
	disabled: boolean;
	selectable: boolean;
	rangeSelectable: boolean;
	selectedDate: Date | null;
	rangeStart: Date | null;
	rangeEnd: Date | null;
	minDate?: Date | undefined;
	maxDate?: Date | undefined;
	onDateSelect?: (date: Date | null) => void;
	onRangeSelect?: (range: { start: Date | null; end: Date | null }) => void;
	setInternalSelectedDate: (date: Date | null) => void;
	setInternalRangeStart: (date: Date | null) => void;
	setInternalRangeEnd: (date: Date | null) => void;
}

/**
 * Return type for month handlers
 */
export interface MonthHandlers {
	handlePreviousMonth: () => void;
	handleNextMonth: () => void;
	handleToday: () => void;
}

/**
 * Return type for calendar handlers hook
 */
export interface CalendarHandlers extends MonthHandlers {
	handleDayClick: (date: Date) => void;
}
