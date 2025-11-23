/**
 * PullToRefreshHelpers Tests
 *
 * Tests for pull-to-refresh helper functions:
 * - getFirstTouch
 * - getIndicatorStyle
 * - isContainerAtTop
 * - calculatePullDistance
 * - getPullState
 * - resetPullState
 */

import {
	calculatePullDistance,
	getFirstTouch,
	getIndicatorStyle,
	getPullState,
	isContainerAtTop,
	MAX_PULL_MULTIPLIER,
	resetPullState,
} from '@core/ui/utilities/pull-to-refresh/helpers/PullToRefreshHelpers';
import type { TouchList } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('PullToRefreshHelpers - getFirstTouch', () => {
	it('returns first touch from touch list', () => {
		const touch1 = { clientX: 100, clientY: 200 } as Touch;
		const touch2 = { clientX: 150, clientY: 250 } as Touch;
		const touches = Object.assign([touch1, touch2], {
			identifiedTouch: undefined,
		}) as unknown as TouchList;

		const result = getFirstTouch(touches);

		expect(result).toBe(touch1);
	});

	it('returns null when touch list is empty', () => {
		const touches = Object.assign([], {
			identifiedTouch: undefined,
		}) as unknown as TouchList;

		const result = getFirstTouch(touches);

		expect(result).toBeNull();
	});

	it('returns null when touch list is empty array-like', () => {
		// Create an empty array-like object that mimics TouchList
		const touches = {
			length: 0,
			item: () => null,
			identifiedTouch: undefined,
		} as unknown as TouchList;

		const result = getFirstTouch(touches);

		expect(result).toBeNull();
	});
});

describe('PullToRefreshHelpers - getIndicatorStyle', () => {
	it('returns hidden style when idle', () => {
		const style = getIndicatorStyle(true);

		expect(style.transform).toBe('translateY(-100%)');
		expect(style.opacity).toBe(0);
	});

	it('returns visible style when not idle', () => {
		const style = getIndicatorStyle(false);

		expect(style.transform).toBe('translateY(0)');
		expect(style.opacity).toBe(1);
	});
});

describe('PullToRefreshHelpers - isContainerAtTop', () => {
	it('returns true when scrollTop is 0', () => {
		const container = document.createElement('div');
		Object.defineProperty(container, 'scrollTop', {
			writable: true,
			value: 0,
		});
		const containerRef = { current: container };

		const result = isContainerAtTop(containerRef);

		expect(result).toBe(true);
	});

	it('returns false when scrollTop is not 0', () => {
		const container = document.createElement('div');
		Object.defineProperty(container, 'scrollTop', {
			writable: true,
			value: 50,
		});
		const containerRef = { current: container };

		const result = isContainerAtTop(containerRef);

		expect(result).toBe(false);
	});

	it('returns false when container is null', () => {
		const containerRef = { current: null };

		const result = isContainerAtTop(containerRef);

		expect(result).toBe(false);
	});

	it('returns false when container is undefined', () => {
		const containerRef = { current: null };

		const result = isContainerAtTop(containerRef);

		expect(result).toBe(false);
	});
});

describe('PullToRefreshHelpers - calculatePullDistance', () => {
	it('returns deltaY when below max distance', () => {
		const threshold = 80;
		const deltaY = 50;
		const maxDistance = threshold * MAX_PULL_MULTIPLIER; // 120

		const result = calculatePullDistance(deltaY, threshold);

		expect(result).toBe(50);
		expect(result).toBeLessThan(maxDistance);
	});

	it('returns max distance when deltaY exceeds max', () => {
		const threshold = 80;
		const deltaY = 200;
		const maxDistance = threshold * MAX_PULL_MULTIPLIER; // 120

		const result = calculatePullDistance(deltaY, threshold);

		expect(result).toBe(maxDistance);
	});

	it('returns exactly max distance when deltaY equals max', () => {
		const threshold = 80;
		const maxDistance = threshold * MAX_PULL_MULTIPLIER; // 120

		const result = calculatePullDistance(maxDistance, threshold);

		expect(result).toBe(maxDistance);
	});

	it('handles different threshold values', () => {
		const threshold1 = 50;
		const threshold2 = 100;
		const deltaY = 100;

		const result1 = calculatePullDistance(deltaY, threshold1);
		const result2 = calculatePullDistance(deltaY, threshold2);

		expect(result1).toBe(75); // 50 * 1.5 = 75
		expect(result2).toBe(100); // 100 * 1.5 = 150, but deltaY is 100, so returns 100
	});
});

describe('PullToRefreshHelpers - getPullState', () => {
	it('returns "release" when distance >= threshold', () => {
		const threshold = 80;

		expect(getPullState(80, threshold)).toBe('release');
		expect(getPullState(100, threshold)).toBe('release');
		expect(getPullState(120, threshold)).toBe('release');
	});

	it('returns "pulling" when distance < threshold', () => {
		const threshold = 80;

		expect(getPullState(0, threshold)).toBe('pulling');
		expect(getPullState(50, threshold)).toBe('pulling');
		expect(getPullState(79, threshold)).toBe('pulling');
	});

	it('handles edge case at threshold boundary', () => {
		const threshold = 80;

		expect(getPullState(79.9, threshold)).toBe('pulling');
		expect(getPullState(80, threshold)).toBe('release');
		expect(getPullState(80.1, threshold)).toBe('release');
	});
});

describe('PullToRefreshHelpers - resetPullState', () => {
	it('resets state to idle', () => {
		const setState = vi.fn();
		const setPullDistance = vi.fn();
		const touchStartY = { current: 100 };

		resetPullState(setState, setPullDistance, touchStartY);

		expect(setState).toHaveBeenCalledWith('idle');
		expect(setPullDistance).toHaveBeenCalledWith(0);
		expect(touchStartY.current).toBeNull();
	});

	it('resets pull distance to 0', () => {
		const setState = vi.fn();
		const setPullDistance = vi.fn();
		const touchStartY = { current: 100 };

		resetPullState(setState, setPullDistance, touchStartY);

		expect(setPullDistance).toHaveBeenCalledWith(0);
	});

	it('resets touchStartY to null', () => {
		const setState = vi.fn();
		const setPullDistance = vi.fn();
		const touchStartY = { current: 100 };

		resetPullState(setState, setPullDistance, touchStartY);

		expect(touchStartY.current).toBeNull();
	});

	it('handles null touchStartY', () => {
		const setState = vi.fn();
		const setPullDistance = vi.fn();
		const touchStartY = { current: null };

		resetPullState(setState, setPullDistance, touchStartY);

		expect(setState).toHaveBeenCalledWith('idle');
		expect(setPullDistance).toHaveBeenCalledWith(0);
		expect(touchStartY.current).toBeNull();
	});
});
