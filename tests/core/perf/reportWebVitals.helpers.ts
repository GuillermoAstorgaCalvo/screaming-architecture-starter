/**
 * Shared test helpers for reportWebVitals tests
 */

import type { MetricType } from 'web-vitals';

// Constants for repeated values
export const NAVIGATION_TYPE_NAVIGATE = 'navigate';
export const RATING_GOOD = 'good';
export const RATING_NEEDS_IMPROVEMENT = 'needs-improvement';
export const MESSAGE_WEB_VITAL_PREFIX = 'Web Vital:';

// Helper to create a mock PerformanceObserver
export function createMockPerformanceObserver() {
	return class MockPerformanceObserver {
		observe() {
			// Mock implementation
		}
		disconnect() {
			// Mock implementation
		}
		takeRecords() {
			return [];
		}
	} as unknown as typeof PerformanceObserver;
}

// Helper to create a mock metric
export function createMockMetric(options: {
	name: MetricType['name'];
	value: number;
	rating: MetricType['rating'];
	id: string;
	delta: number;
	navigationType?: MetricType['navigationType'];
}): MetricType {
	return {
		name: options.name,
		value: options.value,
		rating: options.rating,
		id: options.id,
		delta: options.delta,
		navigationType: options.navigationType ?? NAVIGATION_TYPE_NAVIGATE,
		entries: [],
	};
}
