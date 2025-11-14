import { getTimelineConnectorSizeClasses } from '@core/ui/variants/timeline';
import type { StandardSize } from '@src-types/ui/base';
import type { TimelineEvent, TimelineOrientation } from '@src-types/ui/layout/timeline';
import { useMemo } from 'react';

interface TimelineConnectorProps {
	readonly orientation: TimelineOrientation;
	readonly size: StandardSize;
	readonly previousEvent?: TimelineEvent;
	readonly currentEvent: TimelineEvent;
}

function getConnectorColorClasses(
	previousEvent: TimelineEvent | undefined,
	currentEvent: TimelineEvent
): string {
	// If previous event is completed, connector is primary color
	if (previousEvent?.completed) {
		return 'bg-primary';
	}
	// If current event is active or completed, connector is primary color
	if (currentEvent.active || currentEvent.completed) {
		return 'bg-primary';
	}
	// Default muted connector
	return 'bg-muted';
}

export function TimelineConnector({
	orientation,
	size,
	previousEvent,
	currentEvent,
}: Readonly<TimelineConnectorProps>) {
	const connectorSizeClasses = getTimelineConnectorSizeClasses(size);
	const colorClasses = useMemo(
		() => getConnectorColorClasses(previousEvent, currentEvent),
		[previousEvent, currentEvent]
	);

	if (orientation === 'vertical') {
		return (
			<div className={`${connectorSizeClasses} h-8 ${colorClasses} mt-2 mb-2`} aria-hidden="true" />
		);
	}

	return (
		<div className={`${connectorSizeClasses} w-8 ${colorClasses} mt-2 mb-2`} aria-hidden="true" />
	);
}
