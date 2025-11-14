import { TimelineConnector } from '@core/ui/data-display/timeline/components/TimelineConnector';
import { TimelineEvent } from '@core/ui/data-display/timeline/components/TimelineEvent';
import type { TimelineItemProps } from '@core/ui/data-display/timeline/types/TimelineItem.types';

export function TimelineItem({
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
		<div className={containerClasses}>
			<div className={innerClasses}>
				<TimelineEvent {...eventProps} />
				{showConnectors && !isLast ? <TimelineConnector {...connectorProps} /> : null}
			</div>
		</div>
	);
}
