/**
 * prepareContainerProps Utility Tests
 *
 * Tests for the prepareContainerProps utility function:
 * - Props preparation
 * - Handler forwarding
 * - Indicator integration
 * - Container props merging
 */

import { usePullToRefreshHandlers } from '@core/ui/utilities/pull-to-refresh/hooks/usePullToRefreshHandlers';
import {
	createIndicator,
	type CreateIndicatorResult,
} from '@core/ui/utilities/pull-to-refresh/utils/createIndicator';
import { prepareContainerProps } from '@core/ui/utilities/pull-to-refresh/utils/prepareContainerProps';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

/**
 * Creates test handlers for use in tests
 */
function createTestHandlers(onRefresh = vi.fn()) {
	const { result } = renderHook(() =>
		usePullToRefreshHandlers({
			disabled: false,
			threshold: 80,
			onRefresh,
		})
	);
	return result.current;
}

/**
 * Creates a test indicator with default values
 */
function createTestIndicator(overrides?: {
	isIdle?: boolean;
	isRefreshing?: boolean;
	canRelease?: boolean;
}): CreateIndicatorResult {
	return createIndicator({
		isIdle: true,
		isRefreshing: false,
		canRelease: false,
		...overrides,
	});
}

describe('prepareContainerProps - Props Preparation', () => {
	it('prepares container props correctly', () => {
		const handlers = createTestHandlers();
		const indicator = createTestIndicator();

		const containerProps = prepareContainerProps({
			handlers,
			indicator,
			className: 'custom-class',
			containerProps: {},
		});

		expect(containerProps.containerRef).toBe(handlers.containerRef);
		expect(containerProps.className).toBe('custom-class');
		expect(containerProps.onTouchStart).toBe(handlers.handleTouchStart);
		expect(containerProps.onTouchMove).toBe(handlers.handleTouchMove);
		expect(containerProps.onTouchEnd).toBe(handlers.handleTouchEnd);
		expect(containerProps.indicatorStyle).toBe(indicator.style);
		expect(containerProps.indicator).toBe(indicator.node);
		expect(containerProps.isIdle).toBe(handlers.isIdle);
		expect(containerProps.pullDistance).toBe(handlers.pullDistance);
		expect(containerProps.containerProps).toEqual({});
	});
});

describe('prepareContainerProps - ClassName Handling', () => {
	it('handles undefined className', () => {
		const handlers = createTestHandlers();
		const indicator = createTestIndicator();

		const containerProps = prepareContainerProps({
			handlers,
			indicator,
			containerProps: {},
		});

		expect(containerProps.className).toBeUndefined();
	});
});

describe('prepareContainerProps - Handler Forwarding', () => {
	it('forwards all handler properties', () => {
		const handlers = createTestHandlers();
		const indicator = createTestIndicator({
			isIdle: false,
			canRelease: true,
		});

		const containerProps = prepareContainerProps({
			handlers,
			indicator,
			containerProps: {},
		});

		expect(containerProps.isIdle).toBe(handlers.isIdle);
		expect(containerProps.pullDistance).toBe(handlers.pullDistance);
	});
});

describe('prepareContainerProps - Container Props Merging', () => {
	it('merges container props correctly', () => {
		const handlers = createTestHandlers();
		const indicator = createTestIndicator();

		const containerProps = prepareContainerProps({
			handlers,
			indicator,
			containerProps: {
				'aria-label': 'Pull to refresh',
				id: 'pull-container',
			},
		});

		expect(containerProps.containerProps).toEqual({
			'aria-label': 'Pull to refresh',
			id: 'pull-container',
		});
	});
});

describe('prepareContainerProps - Integration', () => {
	it('can be used with PullToRefreshContainer', () => {
		const handlers = createTestHandlers();
		const indicator = createTestIndicator();

		const containerProps = prepareContainerProps({
			handlers,
			indicator,
			containerProps: {},
		});

		// Verify all required props are present
		expect(containerProps.containerRef).toBeDefined();
		expect(containerProps.onTouchStart).toBeDefined();
		expect(containerProps.onTouchMove).toBeDefined();
		expect(containerProps.onTouchEnd).toBeDefined();
		expect(containerProps.indicatorStyle).toBeDefined();
		expect(containerProps.indicator).toBeDefined();
		expect(containerProps.isIdle).toBeDefined();
		expect(containerProps.pullDistance).toBeDefined();
		expect(containerProps.containerProps).toBeDefined();
	});
});
