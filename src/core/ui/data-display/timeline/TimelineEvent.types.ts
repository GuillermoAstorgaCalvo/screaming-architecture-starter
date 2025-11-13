import type { StandardSize } from '@src-types/ui/base';
import type {
	TimelineEvent as TimelineEventType,
	TimelineOrientation,
} from '@src-types/ui/layout/timeline';

export type TimelineMarkerVariant = 'default' | 'dot' | 'icon' | 'custom';

export interface TimelineEventProps {
	readonly event: TimelineEventType;
	readonly size: StandardSize;
	readonly markerVariant: TimelineMarkerVariant;
	readonly orientation: TimelineOrientation;
	readonly onClick?: (() => void) | undefined;
}

export interface EventContentProps {
	readonly event: TimelineEventType;
	readonly contentClasses: string;
	readonly contentSpacing: string;
}

export interface VerticalTimelineEventProps {
	readonly event: TimelineEventType;
	readonly size: StandardSize;
	readonly markerVariant: TimelineMarkerVariant;
	readonly orientation: TimelineOrientation;
	readonly contentClasses: string;
	readonly contentSpacing: string;
	readonly onClick?: (() => void) | undefined;
}

export interface HorizontalTimelineEventProps {
	readonly event: TimelineEventType;
	readonly size: StandardSize;
	readonly markerVariant: TimelineMarkerVariant;
	readonly orientation: TimelineOrientation;
	readonly containerClasses: string;
	readonly contentClasses: string;
	readonly contentSpacing: string;
	readonly onClick?: (() => void) | undefined;
}
