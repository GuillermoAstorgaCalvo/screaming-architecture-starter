import { CalendarDay } from '@core/ui/calendar/components/CalendarDay';
import { calculateDayState } from '@core/ui/calendar/helpers/CalendarDayState';
import { isToday } from '@core/ui/calendar/helpers/CalendarHelpers';
import type { DayCellOptions, DayCellsOptions } from '@core/ui/calendar/types/CalendarGridTypes';

/**
 * Render a single day cell
 */
export function renderDayCell(options: Readonly<DayCellOptions>) {
	const { day, dayState, onDayClick, renderDay } = options;
	return (
		<CalendarDay
			key={day.getTime()}
			date={day}
			isCurrentMonth={dayState.isCurrentMonth}
			isToday={isToday(day)}
			isSelected={dayState.dayIsSelected}
			isInRange={dayState.dayIsInRange}
			isRangeStart={dayState.dayIsRangeStart}
			isRangeEnd={dayState.dayIsRangeEnd}
			events={dayState.dayEvents}
			disabled={dayState.dayIsDisabled}
			onClick={onDayClick}
			{...(renderDay && { renderDay })}
		/>
	);
}

/**
 * Render all day cells for a week
 */
export function renderDayCells(options: Readonly<DayCellsOptions>) {
	const { week, onDayClick, renderDay, ...dayStateOptions } = options;
	return week.map(day => {
		const dayState = calculateDayState({ ...dayStateOptions, day });
		return renderDayCell({ day, dayState, onDayClick, renderDay });
	});
}
