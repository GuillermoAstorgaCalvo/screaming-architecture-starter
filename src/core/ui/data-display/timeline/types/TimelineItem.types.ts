import type { StandardSize } from '@src-types/ui/base';
import type {
	TimelineEvent as TimelineEventType,
	TimelineMarkerVariant,
	TimelineOrientation,
	TimelineProps,
} from '@src-types/ui/layout/timeline';

export interface TimelineItemProps {
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
