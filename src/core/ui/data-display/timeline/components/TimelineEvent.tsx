import { HorizontalTimelineEvent } from '@core/ui/data-display/timeline/components/HorizontalTimelineEvent';
import {
	getContentSpacing,
	getEventContainerClasses,
	getEventContentClasses,
} from '@core/ui/data-display/timeline/helpers/TimelineEvent.utils';
import type { TimelineEventProps } from '@core/ui/data-display/timeline/types/TimelineEvent.types';

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
