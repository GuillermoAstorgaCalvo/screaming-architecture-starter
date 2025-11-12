import type { CalendarEvent } from '@src-types/ui/data';
import type { ReactElement } from 'react';

import { MAX_VISIBLE_EVENTS } from './CalendarDayConstants';
import type { createDayButtonProps } from './CalendarDayHelpers';
import type { CalendarDayProps } from './CalendarTypes';

/**
 * Default event badge renderer
 */
export function renderDefaultEvent(event: CalendarEvent): ReactElement {
	const colorClasses = {
		default: 'bg-muted text-muted-foreground',
		primary: 'bg-primary text-primary-foreground',
		secondary: 'bg-secondary text-secondary-foreground',
		success: 'bg-green-500 text-white',
		warning: 'bg-yellow-500 text-white',
		error: 'bg-red-500 text-white',
	};

	return (
		<div
			key={event.id}
			className={`text-xs px-1 py-0.5 rounded truncate ${colorClasses[event.color ?? 'default']} ${event.className ?? ''}`}
			title={event.description ?? event.title}
		>
			{event.title}
		</div>
	);
}

/**
 * Default day content renderer
 */
export function renderDefaultDayContent(dayNumber: number, events?: CalendarEvent[]): ReactElement {
	return (
		<>
			<div className="w-full text-center">{dayNumber}</div>
			{events && events.length > 0 ? (
				<div className="w-full mt-1 space-y-0.5 flex flex-col">
					{events.slice(0, MAX_VISIBLE_EVENTS).map(event => renderDefaultEvent(event))}
					{events.length > MAX_VISIBLE_EVENTS && (
						<div className="text-xs text-muted-foreground">
							+{events.length - MAX_VISIBLE_EVENTS}
						</div>
					)}
				</div>
			) : null}
		</>
	);
}

/**
 * Render day cell button
 */
export function renderDayButton(props: {
	buttonProps: ReturnType<typeof createDayButtonProps>;
	renderDay?: CalendarDayProps['renderDay'];
	dayProps: CalendarDayProps;
	dayNumber: number;
	events?: CalendarEvent[];
}): ReactElement {
	if (props.renderDay) {
		return <button {...props.buttonProps}>{props.renderDay(props.dayProps)}</button>;
	}
	return (
		<button {...props.buttonProps}>{renderDefaultDayContent(props.dayNumber, props.events)}</button>
	);
}
