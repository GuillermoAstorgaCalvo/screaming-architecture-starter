import type { CalendarEvent } from '@src-types/ui/data';
import type { KeyboardEvent } from 'react';

import type { CalendarDayProps } from './CalendarTypes';

/**
 * Get aria label for day
 */
export function getDayAriaLabel(date: Date, isToday: boolean, events?: CalendarEvent[]): string {
	let label = date.toLocaleDateString();
	if (isToday) {
		label += ', today';
	}
	if (events && events.length > 0) {
		const eventText = events.length === 1 ? 'event' : 'events';
		label += `, ${events.length} ${eventText}`;
	}
	return label;
}

/**
 * Create button props for day cell
 */
export function createDayButtonProps(props: {
	dayClasses: string;
	ariaLabel: string;
	isSelected: boolean;
	disabled: boolean;
	onClick: () => void;
	onKeyDown: (event: KeyboardEvent) => void;
}) {
	return {
		type: 'button' as const,
		className: props.dayClasses,
		onClick: props.onClick,
		onKeyDown: props.onKeyDown,
		role: 'gridcell' as const,
		'aria-selected': props.isSelected,
		'aria-label': props.ariaLabel,
		disabled: props.disabled,
		tabIndex: props.disabled ? -1 : 0,
	};
}

/**
 * Create day event handlers
 */
export function createDayHandlers(
	date: Date,
	disabled: boolean,
	onClick?: (date: Date) => void
): {
	handleClick: () => void;
	handleKeyDown: (event: KeyboardEvent) => void;
} {
	return {
		handleClick: () => {
			if (!disabled && onClick) {
				onClick(date);
			}
		},
		handleKeyDown: (event: KeyboardEvent) => {
			if ((event.key === 'Enter' || event.key === ' ') && !disabled && onClick) {
				event.preventDefault();
				onClick(date);
			}
		},
	};
}

/**
 * Create day props object
 */
export function createDayProps(
	props: Readonly<
		CalendarDayProps & { weekdayNames?: string[]; showWeekNumber?: boolean; weekNumber?: number }
	>
): CalendarDayProps {
	const dayProps: CalendarDayProps = {
		date: props.date,
		isCurrentMonth: props.isCurrentMonth,
		isToday: props.isToday,
	};
	if (props.isSelected !== undefined) dayProps.isSelected = props.isSelected;
	if (props.isInRange !== undefined) dayProps.isInRange = props.isInRange;
	if (props.isRangeStart !== undefined) dayProps.isRangeStart = props.isRangeStart;
	if (props.isRangeEnd !== undefined) dayProps.isRangeEnd = props.isRangeEnd;
	if (props.events !== undefined) dayProps.events = props.events;
	if (props.disabled !== undefined) dayProps.disabled = props.disabled;
	if (props.onClick !== undefined) dayProps.onClick = props.onClick;
	return dayProps;
}
