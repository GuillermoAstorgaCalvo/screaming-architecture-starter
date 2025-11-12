import {
	TIMELINE_BASE_CLASSES,
	TIMELINE_CONNECTOR_SIZE_CLASSES,
	TIMELINE_EVENT_SIZE_CLASSES,
	TIMELINE_MARKER_ICON_SIZE_CLASSES,
	TIMELINE_MARKER_SIZE_CLASSES,
	TIMELINE_ORIENTATION_CLASSES,
} from '@core/constants/ui/display';
import type { StandardSize } from '@src-types/ui/base';
import type { TimelineOrientation } from '@src-types/ui/layout/timeline';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Timeline variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Timeline component.
 */
export const timelineVariants = cva(TIMELINE_BASE_CLASSES, {
	variants: {
		orientation: {
			vertical: TIMELINE_ORIENTATION_CLASSES.vertical,
			horizontal: TIMELINE_ORIENTATION_CLASSES.horizontal,
		} satisfies Record<TimelineOrientation, string>,
	},
	defaultVariants: {
		orientation: 'vertical',
	},
});

/**
 * Type for timeline variant props
 * Extracted from timelineVariants using VariantProps
 */
export type TimelineVariants = VariantProps<typeof timelineVariants>;

/**
 * Helper function to get timeline class names with proper merging
 *
 * @param props - Timeline variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getTimelineVariantClasses(
	props: TimelineVariants & { className?: string | undefined }
): string {
	return twMerge(timelineVariants(props), props.className);
}

/**
 * Helper function to get timeline event size classes
 *
 * @param size - Event size
 * @returns Size classes string
 */
export function getTimelineEventSizeClasses(size: StandardSize): string {
	return TIMELINE_EVENT_SIZE_CLASSES[size];
}

/**
 * Helper function to get timeline marker size classes
 *
 * @param size - Marker size
 * @returns Size classes string
 */
export function getTimelineMarkerSizeClasses(size: StandardSize): string {
	return TIMELINE_MARKER_SIZE_CLASSES[size];
}

/**
 * Helper function to get timeline marker icon size classes
 *
 * @param size - Marker icon size
 * @returns Size classes string
 */
export function getTimelineMarkerIconSizeClasses(size: StandardSize): string {
	return TIMELINE_MARKER_ICON_SIZE_CLASSES[size];
}

/**
 * Helper function to get timeline connector size classes
 *
 * @param size - Connector size
 * @returns Size classes string
 */
export function getTimelineConnectorSizeClasses(size: StandardSize): string {
	return TIMELINE_CONNECTOR_SIZE_CLASSES[size];
}
