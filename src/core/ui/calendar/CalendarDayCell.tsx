import { CalendarDay } from './CalendarDay';
import { calculateDayState } from './CalendarDayState';
import type { DayCellOptions, DayCellsOptions } from './CalendarGridTypes';
import { isToday } from './CalendarHelpers';

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
