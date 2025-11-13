import { TimelineConnector } from '@core/ui/data-display/timeline/components/TimelineConnector';
import { TimelineEvent } from '@core/ui/data-display/timeline/components/TimelineEvent';
import { getTimelineVariantClasses } from '@core/ui/variants/timeline';
import type { StandardSize } from '@src-types/ui/base';
import type {
	TimelineEvent as TimelineEventType,
	TimelineMarkerVariant,
	TimelineOrientation,
	TimelineProps,
} from '@src-types/ui/layout/timeline';
import { useMemo } from 'react';

interface TimelineItemProps {
	readonly event: TimelineEventType;
	readonly index: number;
	readonly isLast: boolean;
	readonly previousEvent?: TimelineEventType;
	readonly size: StandardSize;
	readonly markerVariant: TimelineMarkerVariant;
	readonly orientation: TimelineOrientation;
	readonly showConnectors: boolean;
	readonly onEventClick?: TimelineProps['onEventClick'];
}

function TimelineItem({
	event,
	index,
	isLast,
	previousEvent,
	size,
	markerVariant,
	orientation,
	showConnectors,
	onEventClick,
}: Readonly<TimelineItemProps>) {
	const eventProps = {
		event,
		size,
		markerVariant,
		orientation,
		...(onEventClick && { onClick: () => onEventClick(event.id, index) }),
	};
	const connectorProps = {
		orientation,
		size,
		currentEvent: event,
		...(previousEvent && { previousEvent }),
	};
	const isVertical = orientation === 'vertical';
	const containerClasses = isVertical ? 'flex items-start' : 'flex flex-col items-center';
	const innerClasses = isVertical
		? 'flex flex-col items-center shrink-0'
		: 'flex flex-col items-center';

	return (
		<div key={event.id} className={containerClasses}>
			<div className={innerClasses}>
				<TimelineEvent {...eventProps} />
				{showConnectors && !isLast ? <TimelineConnector {...connectorProps} /> : null}
			</div>
		</div>
	);
}

/**
 * Timeline - Chronological events component (activity feeds, history, process steps)
 *
 * Features:
 * - Vertical and horizontal layouts
 * - Event markers (default, dot, icon, custom)
 * - Connectors between events
 * - Size variants: sm, md, lg
 * - Active and completed states
 * - Clickable events
 * - Accessible: proper ARIA attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Timeline
 *   events={[
 *     {
 *       id: '1',
 *       title: 'Event 1',
 *       description: 'Description',
 *       timestamp: '2024-01-01',
 *       completed: true,
 *     },
 *     {
 *       id: '2',
 *       title: 'Event 2',
 *       description: 'Description',
 *       timestamp: '2024-01-02',
 *       active: true,
 *     },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Timeline
 *   orientation="horizontal"
 *   markerVariant="icon"
 *   events={events}
 *   onEventClick={(eventId, index) => console.log(eventId, index)}
 * />
 * ```
 */
export default function Timeline({
	events,
	orientation = 'vertical',
	size = 'md',
	markerVariant = 'default',
	showConnectors = true,
	onEventClick,
	className,
	'aria-label': ariaLabel = 'Timeline',
	...props
}: Readonly<TimelineProps>) {
	const timelineClasses = useMemo(
		() => getTimelineVariantClasses({ orientation, className }),
		[orientation, className]
	);

	return (
		<div className={timelineClasses} aria-label={ariaLabel} {...props}>
			{events.map((event, index) => {
				const previousEvent = index > 0 ? events[index - 1] : undefined;
				return (
					<TimelineItem
						key={event.id}
						event={event}
						index={index}
						isLast={index === events.length - 1}
						{...(previousEvent && { previousEvent })}
						size={size}
						markerVariant={markerVariant}
						orientation={orientation}
						showConnectors={showConnectors}
						onEventClick={onEventClick}
					/>
				);
			})}
		</div>
	);
}
