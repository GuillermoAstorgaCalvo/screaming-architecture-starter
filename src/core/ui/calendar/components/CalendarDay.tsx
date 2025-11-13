import {
	createDayButtonProps,
	createDayHandlers,
	createDayProps,
	getDayAriaLabel,
} from './CalendarDayHelpers';
import { renderDayButton } from './CalendarDayRenderers';
import { getDayClasses } from './CalendarDayStyles';
import type { CalendarDayProps } from './CalendarTypes';

interface CalendarDayCellProps extends CalendarDayProps {
	/** Weekday names for header */
	weekdayNames?: string[];
	/** Whether to show week number */
	showWeekNumber?: boolean;
	/** Week number for this row */
	weekNumber?: number;
}

/**
 * Calendar day cell component
 */
export function CalendarDay(props: Readonly<CalendarDayCellProps>) {
	const { handleClick, handleKeyDown } = createDayHandlers(
		props.date,
		props.disabled ?? false,
		props.onClick
	);
	const dayClassesParams: Parameters<typeof getDayClasses>[0] = {
		isCurrentMonth: props.isCurrentMonth,
		isToday: props.isToday,
	};
	if (props.isSelected !== undefined) dayClassesParams.isSelected = props.isSelected;
	if (props.isInRange !== undefined) dayClassesParams.isInRange = props.isInRange;
	if (props.isRangeStart !== undefined) dayClassesParams.isRangeStart = props.isRangeStart;
	if (props.isRangeEnd !== undefined) dayClassesParams.isRangeEnd = props.isRangeEnd;
	if (props.disabled !== undefined) dayClassesParams.disabled = props.disabled;
	const dayClasses = getDayClasses(dayClassesParams);
	const dayNumber = props.date.getDate();
	const ariaLabel = getDayAriaLabel(props.date, props.isToday, props.events);
	const buttonProps = createDayButtonProps({
		dayClasses,
		ariaLabel,
		isSelected: props.isSelected ?? false,
		disabled: props.disabled ?? false,
		onClick: handleClick,
		onKeyDown: handleKeyDown,
	});
	const dayProps = createDayProps(props);
	const renderProps = {
		buttonProps,
		renderDay: props.renderDay,
		dayProps,
		dayNumber,
		...(props.events !== undefined && { events: props.events }),
	};

	return renderDayButton(renderProps);
}
