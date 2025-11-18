import {
	STEPPER_BASE_CLASSES,
	STEPPER_ORIENTATION_CLASSES,
	STEPPER_STEP_SIZE_CLASSES,
} from '@core/constants/ui/display/stepper';
import { describe, expect, it } from 'vitest';

describe('stepper constants', () => {
	it('locks base, orientation, and size classes', () => {
		expect(STEPPER_BASE_CLASSES).toBe('flex');
		expect(STEPPER_ORIENTATION_CLASSES).toEqual({
			horizontal: 'flex-row items-center',
			vertical: 'flex-col',
		});
		expect(STEPPER_STEP_SIZE_CLASSES).toEqual({
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
		});
	});
});
