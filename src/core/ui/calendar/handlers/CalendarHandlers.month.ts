import type {
	MonthChangeParams,
	MonthHandlers,
	MonthNavigationParams,
} from '@core/ui/calendar/types/CalendarHandlersTypes';

/**
 * Changes the displayed month
 */
function changeMonth(params: MonthChangeParams): void {
	const { newMonth, setInternalMonth, onMonthChange } = params;
	setInternalMonth(newMonth);
	onMonthChange?.(newMonth);
}

/**
 * Creates handler for navigating to previous month
 */
function createHandlePreviousMonth(params: MonthNavigationParams): () => void {
	return () => {
		const { displayMonth, setInternalMonth, onMonthChange } = params;
		const newMonth = new Date(displayMonth);
		newMonth.setMonth(newMonth.getMonth() - 1);
		changeMonth({ newMonth, setInternalMonth, ...(onMonthChange && { onMonthChange }) });
	};
}

/**
 * Creates handler for navigating to next month
 */
function createHandleNextMonth(params: MonthNavigationParams): () => void {
	return () => {
		const { displayMonth, setInternalMonth, onMonthChange } = params;
		const newMonth = new Date(displayMonth);
		newMonth.setMonth(newMonth.getMonth() + 1);
		changeMonth({ newMonth, setInternalMonth, ...(onMonthChange && { onMonthChange }) });
	};
}

/**
 * Creates handler for navigating to current month (today)
 */
function createHandleToday(params: {
	setInternalMonth: (month: Date) => void;
	onMonthChange?: (month: Date) => void;
}): () => void {
	return () => {
		const { setInternalMonth, onMonthChange } = params;
		const today = new Date();
		const newMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		changeMonth({ newMonth, setInternalMonth, ...(onMonthChange && { onMonthChange }) });
	};
}

/**
 * Builds all month navigation handlers
 */
export function buildMonthHandlers(params: MonthNavigationParams): MonthHandlers {
	const { displayMonth, setInternalMonth, onMonthChange } = params;
	const monthParams = {
		displayMonth,
		setInternalMonth,
		...(onMonthChange && { onMonthChange }),
	};

	return {
		handlePreviousMonth: createHandlePreviousMonth(monthParams),
		handleNextMonth: createHandleNextMonth(monthParams),
		handleToday: createHandleToday({ setInternalMonth, ...(onMonthChange && { onMonthChange }) }),
	};
}
