import {
	TIMELINE_BASE_CLASSES,
	TIMELINE_CONNECTOR_SIZE_CLASSES,
	TIMELINE_EVENT_SIZE_CLASSES,
	TIMELINE_MARKER_ICON_SIZE_CLASSES,
	TIMELINE_MARKER_SIZE_CLASSES,
	TIMELINE_ORIENTATION_CLASSES,
} from '@core/constants/ui/display/timeline';
import { describe, expect, it } from 'vitest';

describe('timeline constants', () => {
	it('locks base, orientation, and size classes', () => {
		expect(TIMELINE_BASE_CLASSES).toBe('flex');
		expect(TIMELINE_ORIENTATION_CLASSES).toEqual({
			vertical: 'flex-col',
			horizontal: 'flex-row',
		});
		expect(TIMELINE_EVENT_SIZE_CLASSES).toEqual({
			sm: 'text-sm gap-sm',
			md: 'text-base gap-md',
			lg: 'text-lg gap-lg',
		});
		expect(TIMELINE_MARKER_SIZE_CLASSES).toEqual({
			sm: 'w-2 h-2',
			md: 'w-3 h-3',
			lg: 'w-4 h-4',
		});
		expect(TIMELINE_MARKER_ICON_SIZE_CLASSES).toEqual({
			sm: 'w-6 h-6',
			md: 'w-8 h-8',
			lg: 'w-10 h-10',
		});
		expect(TIMELINE_CONNECTOR_SIZE_CLASSES).toEqual({
			sm: 'w-0.5',
			md: 'w-0.5',
			lg: 'w-1',
		});
	});
});
