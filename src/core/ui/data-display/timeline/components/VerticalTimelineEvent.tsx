import { EventContent } from '@core/ui/data-display/timeline/components/TimelineEventContent';
import { TimelineMarker } from '@core/ui/data-display/timeline/components/TimelineMarker';
import { renderEventContent } from '@core/ui/data-display/timeline/helpers/TimelineEventContent.render';
import type { VerticalTimelineEventProps } from '@core/ui/data-display/timeline/types/TimelineEvent.types';

export function VerticalTimelineEvent({
	event,
	size,
	markerVariant,
	orientation,
	contentClasses,
	contentSpacing,
	onClick,
}: Readonly<VerticalTimelineEventProps>) {
	const isClickable = Boolean(onClick);
	const clickableClasses = `${contentClasses} ${contentSpacing} text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50`;

	return (
		<>
			<TimelineMarker event={event} size={size} variant={markerVariant} orientation={orientation} />
			{isClickable ? (
				<button type="button" onClick={onClick} className={clickableClasses}>
					{renderEventContent(event)}
				</button>
			) : (
				<EventContent
					event={event}
					contentClasses={contentClasses}
					contentSpacing={contentSpacing}
				/>
			)}
		</>
	);
}
