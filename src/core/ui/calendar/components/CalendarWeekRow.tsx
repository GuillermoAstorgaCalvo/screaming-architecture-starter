import { renderDayCells } from '@core/ui/calendar/components/CalendarDayCell';
import { getWeekNumber } from '@core/ui/calendar/helpers/CalendarHelpers';
import type {
	DayCellsOptions,
	WeekRowContainerOptions,
	WeekRowOptions,
} from '@core/ui/calendar/types/CalendarGridTypes';

interface WeekMetadata {
	weekKey: number;
	weekNumber: number;
}

/**
 * Calculate week metadata (key and number)
 */
function calculateWeekMetadata(week: Date[], weekIndex: number): WeekMetadata {
	const [firstDay] = week;
	const weekKey = firstDay?.getTime() ?? weekIndex;
	const weekNumber = firstDay ? getWeekNumber(firstDay) : 0;
	return { weekKey, weekNumber };
}

/**
 * Render week number cell
 */
function renderWeekNumberCell(weekNumber: number) {
	return <div className="p-2 text-xs text-center text-muted-foreground border-r">{weekNumber}</div>;
}

/**
 * Build day cells options from week row options
 */
function buildDayCellsOptions(options: Readonly<WeekRowOptions>): Readonly<DayCellsOptions> {
	const {
		week,
		displayMonth,
		events,
		selectable,
		selectedDate,
		rangeSelectable,
		rangeStart,
		rangeEnd,
		minDate,
		maxDate,
		disabled,
		onDayClick,
		renderDay,
	} = options;
	return {
		week,
		displayMonth,
		events,
		selectable,
		selectedDate,
		rangeSelectable,
		rangeStart,
		rangeEnd,
		minDate,
		maxDate,
		disabled,
		onDayClick,
		renderDay,
	};
}

/**
 * Render the week row container structure
 */
function renderWeekRowContainer(options: Readonly<WeekRowContainerOptions>) {
	const { weekKey, showWeekNumbers, weekNumber, dayCells } = options;
	// Using div with role for CSS Grid layout - semantic table elements would break the grid
	return (
		<div key={weekKey} className="grid grid-cols-7 border-b last:border-b-0" role="row">
			{showWeekNumbers ? renderWeekNumberCell(weekNumber) : null}
			{dayCells}
		</div>
	);
}

/**
 * Render a week row
 */
export function renderWeekRow(options: Readonly<WeekRowOptions>) {
	const { week, weekIndex, showWeekNumbers } = options;
	const { weekKey, weekNumber } = calculateWeekMetadata(week, weekIndex);
	const dayCellsOptions = buildDayCellsOptions(options);
	const dayCells = renderDayCells(dayCellsOptions);

	return renderWeekRowContainer({
		weekKey,
		showWeekNumbers,
		weekNumber,
		dayCells,
	});
}
