import {
	getTimelineMarkerIconSizeClasses,
	getTimelineMarkerSizeClasses,
} from '@core/ui/variants/timeline';
import type { StandardSize } from '@src-types/ui/base';
import type { TimelineEvent, TimelineOrientation } from '@src-types/ui/layout/timeline';

interface TimelineMarkerProps {
	readonly event: TimelineEvent;
	readonly size: StandardSize;
	readonly variant: 'default' | 'dot' | 'icon' | 'custom';
	readonly orientation: TimelineOrientation;
}

function getMarkerStatusClasses(
	active: boolean | undefined,
	completed: boolean | undefined
): string {
	if (completed) {
		return 'bg-primary border-primary text-primary-foreground';
	}
	if (active) {
		return 'bg-primary border-primary text-primary-foreground ring-2 ring-primary ring-offset-2';
	}
	return 'bg-muted border-border text-text-secondary';
}

function DefaultMarker({
	event,
	size,
	orientation,
}: {
	readonly event: TimelineEvent;
	readonly size: StandardSize;
	readonly orientation: TimelineOrientation;
}) {
	const markerSizeClasses = getTimelineMarkerSizeClasses(size);
	const statusClasses = getMarkerStatusClasses(event.active, event.completed);
	const baseClasses = `rounded-full border-medium flex items-center justify-center shrink-0 ${markerSizeClasses} ${statusClasses}`;
	const positionClasses = orientation === 'vertical' ? 'mt-xs' : 'mx-auto';

	return <div className={`${baseClasses} ${positionClasses}`} aria-hidden="true" />;
}

function DotMarker({
	event,
	size,
	orientation,
}: {
	readonly event: TimelineEvent;
	readonly size: StandardSize;
	readonly orientation: TimelineOrientation;
}) {
	const markerSizeClasses = getTimelineMarkerSizeClasses(size);
	const statusClasses = getMarkerStatusClasses(event.active, event.completed);
	const baseClasses = `rounded-full ${markerSizeClasses} ${statusClasses}`;
	const positionClasses = orientation === 'vertical' ? 'mt-xs' : 'mx-auto';

	return <div className={`${baseClasses} ${positionClasses}`} aria-hidden="true" />;
}

function IconMarker({
	event,
	size,
	orientation,
}: {
	readonly event: TimelineEvent;
	readonly size: StandardSize;
	readonly orientation: TimelineOrientation;
}) {
	const iconSizeClasses = getTimelineMarkerIconSizeClasses(size);
	const statusClasses = getMarkerStatusClasses(event.active, event.completed);
	const baseClasses = `rounded-full border-medium flex items-center justify-center shrink-0 ${iconSizeClasses} ${statusClasses}`;
	const positionClasses = orientation === 'vertical' ? 'mt-xs' : 'mx-auto';

	return (
		<div className={`${baseClasses} ${positionClasses}`} aria-hidden="true">
			{event.icon ? (
				<span className="w-4 h-4 flex items-center justify-center">{event.icon}</span>
			) : (
				<DefaultMarker event={event} size={size} orientation={orientation} />
			)}
		</div>
	);
}

function CustomMarker({
	event,
	orientation,
}: {
	readonly event: TimelineEvent;
	readonly orientation: TimelineOrientation;
}) {
	const positionClasses = orientation === 'vertical' ? 'mt-xs' : 'mx-auto';

	return (
		<div className={`shrink-0 ${positionClasses}`} aria-hidden="true">
			{event.customMarker}
		</div>
	);
}

export function TimelineMarker({
	event,
	size,
	variant,
	orientation,
}: Readonly<TimelineMarkerProps>) {
	switch (variant) {
		case 'dot': {
			return <DotMarker event={event} size={size} orientation={orientation} />;
		}
		case 'icon': {
			return <IconMarker event={event} size={size} orientation={orientation} />;
		}
		case 'custom': {
			return <CustomMarker event={event} orientation={orientation} />;
		}
		case 'default':
		default: {
			return <DefaultMarker event={event} size={size} orientation={orientation} />;
		}
	}
}
