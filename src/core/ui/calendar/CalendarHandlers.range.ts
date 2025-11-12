import type { RangeSelectionParams } from './CalendarHandlersTypes';

/**
 * Handles range selection logic for calendar dates
 */
export function handleRangeSelection(params: RangeSelectionParams): void {
	const { date, rangeStart, rangeEnd, setInternalRangeStart, setInternalRangeEnd, onRangeSelect } =
		params;

	if (!rangeStart || rangeEnd) {
		setInternalRangeStart(date);
		setInternalRangeEnd(null);
		onRangeSelect?.({ start: date, end: null });
	} else {
		const start = Math.min(rangeStart.getTime(), date.getTime());
		const end = Math.max(rangeStart.getTime(), date.getTime());
		const startDate = new Date(start);
		const endDate = new Date(end);
		setInternalRangeStart(startDate);
		setInternalRangeEnd(endDate);
		onRangeSelect?.({ start: startDate, end: endDate });
	}
}

/**
 * Builds parameters for range selection handler
 */
export function buildRangeSelectionParams(params: RangeSelectionParams): RangeSelectionParams {
	const { date, rangeStart, rangeEnd, setInternalRangeStart, setInternalRangeEnd, onRangeSelect } =
		params;
	return {
		date,
		rangeStart,
		rangeEnd,
		setInternalRangeStart,
		setInternalRangeEnd,
		...(onRangeSelect && { onRangeSelect }),
	};
}
