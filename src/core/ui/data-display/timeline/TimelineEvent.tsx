import { HorizontalTimelineEvent } from './HorizontalTimelineEvent';
import type { TimelineEventProps } from './TimelineEvent.types';
import {
	getContentSpacing,
	getEventContainerClasses,
	getEventContentClasses,
} from './TimelineEvent.utils';
import { VerticalTimelineEvent } from './VerticalTimelineEvent';

export function TimelineEvent({
	event,
	size,
	markerVariant,
	orientation,
	onClick,
}: Readonly<TimelineEventProps>) {
	const containerClasses = getEventContainerClasses(orientation);
	const contentClasses = getEventContentClasses(orientation, size);
	const contentSpacing = getContentSpacing(orientation);

	if (orientation === 'vertical') {
		return (
			<VerticalTimelineEvent
				event={event}
				size={size}
				markerVariant={markerVariant}
				orientation={orientation}
				contentClasses={contentClasses}
				contentSpacing={contentSpacing}
				onClick={onClick}
			/>
		);
	}

	return (
		<HorizontalTimelineEvent
			event={event}
			size={size}
			markerVariant={markerVariant}
			orientation={orientation}
			containerClasses={containerClasses}
			contentClasses={contentClasses}
			contentSpacing={contentSpacing}
			onClick={onClick}
		/>
	);
}
