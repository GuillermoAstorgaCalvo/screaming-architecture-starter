/**
 * Tests for scaleTransition helper
 *
 * Tests the scale transition functions:
 * - Transition building
 * - Duration handling
 * - Easing handling
 * - Delay handling
 */

import { buildScaleTransition } from '@core/ui/utilities/motion/helpers/MotionScale/scaleTransition';
import { getMotionDuration, getMotionEasing } from '@core/ui/utilities/motion/helpers/motionUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/utilities/motion/helpers/motionUtils');

const mockGetMotionDuration = vi.mocked(getMotionDuration);
const mockGetMotionEasing = vi.mocked(getMotionEasing);

function setupMocks() {
	vi.clearAllMocks();
	mockGetMotionDuration.mockReturnValue(0.3);
	mockGetMotionEasing.mockReturnValue([0, 0, 0.58, 1] as const);
}

describe('buildScaleTransition - default values', () => {
	beforeEach(() => {
		setupMocks();
	});

	it('builds transition with default values', () => {
		const result = buildScaleTransition({
			duration: undefined,
			ease: undefined,
			delay: undefined,
		});

		expect(mockGetMotionDuration).toHaveBeenCalledWith('normal');
		expect(mockGetMotionEasing).toHaveBeenCalledWith('ease-out');
		expect(result).toEqual({
			duration: 0.3,
			ease: [0, 0, 0.58, 1],
		});
		expect(result).not.toHaveProperty('delay');
	});
});

describe('buildScaleTransition - custom duration', () => {
	beforeEach(() => {
		setupMocks();
	});

	it('builds transition with custom duration', () => {
		mockGetMotionDuration.mockReturnValue(0.5);
		const result = buildScaleTransition({
			duration: 'slow',
			ease: undefined,
			delay: undefined,
		});

		expect(mockGetMotionDuration).toHaveBeenCalledWith('slow');
		expect(result).toEqual({
			duration: 0.5,
			ease: [0, 0, 0.58, 1],
		});
	});
});

describe('buildScaleTransition - custom ease', () => {
	beforeEach(() => {
		setupMocks();
	});

	it('builds transition with custom ease', () => {
		mockGetMotionEasing.mockReturnValue([0.42, 0, 1, 1] as const);
		const result = buildScaleTransition({
			duration: undefined,
			ease: 'ease-in',
			delay: undefined,
		});

		expect(mockGetMotionEasing).toHaveBeenCalledWith('ease-in');
		expect(result).toEqual({
			duration: 0.3,
			ease: [0.42, 0, 1, 1],
		});
	});
});

describe('buildScaleTransition - custom delay', () => {
	beforeEach(() => {
		setupMocks();
	});

	it('builds transition with custom delay', () => {
		const result = buildScaleTransition({
			duration: undefined,
			ease: undefined,
			delay: 0.5,
		});

		expect(result).toEqual({
			duration: 0.3,
			ease: [0, 0, 0.58, 1],
			delay: 0.5,
		});
	});

	it('handles delay of 0', () => {
		const result = buildScaleTransition({
			duration: undefined,
			ease: undefined,
			delay: 0,
		});

		expect(result).toEqual({
			duration: 0.3,
			ease: [0, 0, 0.58, 1],
			delay: 0,
		});
	});

	it('omits delay when undefined', () => {
		const result = buildScaleTransition({
			duration: undefined,
			ease: undefined,
			delay: undefined,
		});

		expect(result).not.toHaveProperty('delay');
	});
});

describe('buildScaleTransition - combined values', () => {
	beforeEach(() => {
		setupMocks();
	});

	it('builds transition with all custom values', () => {
		mockGetMotionDuration.mockReturnValue(0.5);
		mockGetMotionEasing.mockReturnValue([0.42, 0, 1, 1] as const);
		const result = buildScaleTransition({
			duration: 'slow',
			ease: 'ease-in',
			delay: 0.5,
		});

		expect(mockGetMotionDuration).toHaveBeenCalledWith('slow');
		expect(mockGetMotionEasing).toHaveBeenCalledWith('ease-in');
		expect(result).toEqual({
			duration: 0.5,
			ease: [0.42, 0, 1, 1],
			delay: 0.5,
		});
	});
});

describe('buildScaleTransition - duration tokens', () => {
	beforeEach(() => {
		setupMocks();
	});

	it('handles different duration tokens', () => {
		const durations: Array<'fast' | 'normal' | 'slow'> = ['fast', 'normal', 'slow'];
		for (const duration of durations) {
			let durationValue: number;
			if (duration === 'fast') {
				durationValue = 0.15;
			} else if (duration === 'normal') {
				durationValue = 0.3;
			} else {
				durationValue = 0.5;
			}
			mockGetMotionDuration.mockReturnValue(durationValue);
			const result = buildScaleTransition({
				duration,
				ease: undefined,
				delay: undefined,
			});

			expect(mockGetMotionDuration).toHaveBeenCalledWith(duration);
			expect(result.duration).toBeGreaterThan(0);
		}
	});
});

describe('buildScaleTransition - easing tokens', () => {
	beforeEach(() => {
		setupMocks();
	});

	it('handles different easing tokens', () => {
		const easings: Array<'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'> = [
			'ease',
			'ease-in',
			'ease-out',
			'ease-in-out',
		];
		for (const ease of easings) {
			mockGetMotionEasing.mockReturnValue([0, 0, 0.58, 1] as const);
			const result = buildScaleTransition({
				duration: undefined,
				ease,
				delay: undefined,
			});

			expect(mockGetMotionEasing).toHaveBeenCalledWith(ease);
			expect(result.ease).toHaveLength(4);
		}
	});
});
