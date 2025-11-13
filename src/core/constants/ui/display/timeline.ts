/**
 * Timeline display constants
 */
import type { StandardSize } from '@src-types/ui/base';
import type { TimelineOrientation } from '@src-types/ui/layout/timeline';

export const TIMELINE_BASE_CLASSES = 'flex';

export const TIMELINE_ORIENTATION_CLASSES: Record<TimelineOrientation, string> = {
	vertical: 'flex-col',
	horizontal: 'flex-row',
} as const;

export const TIMELINE_EVENT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm gap-2',
	md: 'text-base gap-3',
	lg: 'text-lg gap-4',
} as const;

export const TIMELINE_MARKER_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'w-2 h-2',
	md: 'w-3 h-3',
	lg: 'w-4 h-4',
} as const;

export const TIMELINE_MARKER_ICON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'w-6 h-6',
	md: 'w-8 h-8',
	lg: 'w-10 h-10',
} as const;

export const TIMELINE_CONNECTOR_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'w-0.5',
	md: 'w-0.5',
	lg: 'w-1',
} as const;
