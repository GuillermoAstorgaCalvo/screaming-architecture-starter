import { getTimelineEventSizeClasses } from '@core/ui/variants/timeline';
import type { StandardSize } from '@src-types/ui/base';
import type { TimelineOrientation } from '@src-types/ui/layout/timeline';

export function getEventContentClasses(
	orientation: TimelineOrientation,
	size: StandardSize
): string {
	const sizeClasses = getTimelineEventSizeClasses(size);
	const layoutClasses =
		orientation === 'vertical' ? 'flex flex-col' : 'flex flex-col items-center text-center';
	return `${sizeClasses} ${layoutClasses}`;
}

export function getEventContainerClasses(orientation: TimelineOrientation): string {
	return orientation === 'vertical' ? 'flex items-start' : 'flex flex-col items-center';
}

export function getContentSpacing(orientation: TimelineOrientation): string {
	return orientation === 'vertical' ? 'ml-4' : 'mt-4';
}
