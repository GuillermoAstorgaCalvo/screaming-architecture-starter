import { CalendarView } from '@core/ui/calendar/components/CalendarView';
import { toDate } from '@core/ui/calendar/helpers/CalendarHelpers';
import { useCalendarHandlers } from '@core/ui/calendar/hooks/useCalendarHandlers';
import { useCalendarState } from '@core/ui/calendar/hooks/useCalendarState';
import type { CalendarProps } from '@src-types/ui/data/calendar';

/**
 * Calendar - Standalone calendar view component
 *
 * Features:
 * - Month view with navigation
 * - Event display
 * - Date selection (single and range)
 * - Date range visualization
 * - Accessible: proper ARIA attributes
 * - Customizable: custom day and event renderers
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Calendar
 *   month={new Date()}
 *   events={[
 *     { id: '1', date: new Date(), title: 'Meeting' }
 *   ]}
 *   onDateSelect={(date) => console.log(date)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Calendar
 *   rangeSelectable
 *   selectedRange={{ start: startDate, end: endDate }}
 *   onRangeSelect={(range) => setRange(range)}
 *   minDate={new Date()}
 * />
 * ```
 */
export default function Calendar(props: Readonly<CalendarProps>) {
	const state = useCalendarState(props);
	const opts = {
		selectable: props.selectable ?? false,
		rangeSelectable: props.rangeSelectable ?? false,
		disabled: props.disabled ?? false,
		locale: props.locale ?? 'en-US',
	};
	const handlers = useCalendarHandlers({
		...state,
		...opts,
		minDate: toDate(props.minDate) ?? undefined,
		maxDate: toDate(props.maxDate) ?? undefined,
		onMonthChange: props.onMonthChange,
		onDateSelect: props.onDateSelect,
		onRangeSelect: props.onRangeSelect,
	});

	return (
		<CalendarView
			state={state}
			handlers={handlers}
			opts={opts}
			minDate={toDate(props.minDate) ?? undefined}
			maxDate={toDate(props.maxDate) ?? undefined}
			props={props}
		/>
	);
}
