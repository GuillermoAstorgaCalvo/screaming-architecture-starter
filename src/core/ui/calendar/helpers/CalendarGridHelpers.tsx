import type { WeekRowOptions } from './CalendarGridTypes';
import { renderWeekRow } from './CalendarWeekRow';

/**
 * Render weekday headers
 */
export function renderWeekdayHeaders(weekdayNames: string[], showWeekNumbers: boolean) {
	// Using div with role for CSS Grid layout - semantic table elements would break the grid
	return (
		<div className="grid grid-cols-7 border-b bg-muted/50" role="row">
			{showWeekNumbers ? <div className="p-2 text-xs font-medium text-muted-foreground" /> : null}
			{weekdayNames.map(name => (
				<div
					key={name}
					className="p-2 text-xs font-medium text-center text-muted-foreground"
					role="columnheader"
				>
					{name}
				</div>
			))}
		</div>
	);
}

/**
 * Render calendar weeks
 */
export function renderCalendarWeeks(
	weeks: Date[][],
	weekRowOptions: Omit<WeekRowOptions, 'week' | 'weekIndex'>
) {
	// Using div with role for CSS Grid layout - semantic table elements would break the grid
	return (
		<div role="rowgroup">
			{weeks.map((week, weekIndex) => renderWeekRow({ ...weekRowOptions, week, weekIndex }))}
		</div>
	);
}
