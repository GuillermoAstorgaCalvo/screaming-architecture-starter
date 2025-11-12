import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Timeline orientation types
 */
export type TimelineOrientation = 'vertical' | 'horizontal';

/**
 * Timeline event marker variant types
 */
export type TimelineMarkerVariant = 'default' | 'dot' | 'icon' | 'custom';

/**
 * Timeline event data
 */
export interface TimelineEvent {
	/** Unique identifier for the event */
	id: string;
	/** Event title/heading */
	title: ReactNode;
	/** Event description/content */
	description?: ReactNode;
	/** Event timestamp (displayed as text) */
	timestamp?: ReactNode;
	/** Optional icon for the event marker */
	icon?: ReactNode;
	/** Optional custom marker element */
	customMarker?: ReactNode;
	/** Whether the event is active/current @default false */
	active?: boolean;
	/** Whether the event is completed @default false */
	completed?: boolean;
	/** Optional additional content below description */
	content?: ReactNode;
}

/**
 * Timeline component props
 */
export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of timeline events */
	events: readonly TimelineEvent[];
	/** Orientation of the timeline @default 'vertical' */
	orientation?: TimelineOrientation;
	/** Size of the timeline @default 'md' */
	size?: StandardSize;
	/** Variant of the event markers @default 'default' */
	markerVariant?: TimelineMarkerVariant;
	/** Whether to show connectors between events @default true */
	showConnectors?: boolean;
	/** Optional click handler for events */
	onEventClick?: (eventId: string, eventIndex: number) => void;
	/** Custom aria-label for timeline @default 'Timeline' */
}
