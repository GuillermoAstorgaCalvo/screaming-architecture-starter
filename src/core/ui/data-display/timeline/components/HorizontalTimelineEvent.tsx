import { EventContent } from '@core/ui/data-display/timeline/components/TimelineEventContent';
import { TimelineMarker } from '@core/ui/data-display/timeline/components/TimelineMarker';
import type { HorizontalTimelineEventProps } from '@core/ui/data-display/timeline/types/TimelineEvent.types';

export function HorizontalTimelineEvent({
	event,
	size,
	markerVariant,
	orientation,
	containerClasses,
	contentClasses,
	contentSpacing,
	onClick,
}: Readonly<HorizontalTimelineEventProps>) {
	const isClickable = Boolean(onClick);
	const clickableClasses = `${containerClasses} cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded transition-colors hover:bg-muted dark:hover:bg-muted`;

	if (isClickable) {
		return (
			<button type="button" onClick={onClick} className={clickableClasses}>
				<TimelineMarker
					event={event}
					size={size}
					variant={markerVariant}
					orientation={orientation}
				/>
				<EventContent
					event={event}
					contentClasses={contentClasses}
					contentSpacing={contentSpacing}
				/>
			</button>
		);
	}

	return (
		<div className={containerClasses}>
			<TimelineMarker event={event} size={size} variant={markerVariant} orientation={orientation} />
			<EventContent event={event} contentClasses={contentClasses} contentSpacing={contentSpacing} />
		</div>
	);
}
