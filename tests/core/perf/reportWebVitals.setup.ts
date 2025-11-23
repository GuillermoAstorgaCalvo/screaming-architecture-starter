/**
 * Shared test setup for reportWebVitals tests
 */

import * as envModule from '@core/config/env.client';
import {
	createMockMetric,
	createMockPerformanceObserver,
	RATING_GOOD,
} from '@tests/core/perf/reportWebVitals.helpers';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { vi } from 'vitest';

// Mock web-vitals module
export const mockOnLCP: ReturnType<typeof vi.fn> = vi.fn();
export const mockOnINP: ReturnType<typeof vi.fn> = vi.fn();
export const mockOnCLS: ReturnType<typeof vi.fn> = vi.fn();
export const mockOnFCP: ReturnType<typeof vi.fn> = vi.fn();
export const mockOnTTFB: ReturnType<typeof vi.fn> = vi.fn();

vi.mock('web-vitals', () => ({
	onLCP: mockOnLCP,
	onINP: mockOnINP,
	onCLS: mockOnCLS,
	onFCP: mockOnFCP,
	onTTFB: mockOnTTFB,
}));

// Shared test state
let _logger: MockLoggerAdapter;
let _originalPerformanceObserver: typeof globalThis.PerformanceObserver | undefined;
let _envSpy: ReturnType<typeof vi.spyOn>;

export function getLogger() {
	return _logger;
}

export function getEnvSpy() {
	return _envSpy;
}

// Helper to setup production environment for tests
export function setupProductionEnv() {
	_envSpy.mockReturnValue({
		...envModule.env,
		PROD: true,
	} as typeof envModule.env);
	globalThis.PerformanceObserver = createMockPerformanceObserver();
}

// Setup function for test environment
export function setupTestEnvironment() {
	_logger = new MockLoggerAdapter();
	_originalPerformanceObserver = globalThis.PerformanceObserver;
	_envSpy = vi.spyOn(envModule, 'env', 'get').mockReturnValue({
		...envModule.env,
		PROD: false,
	} as typeof envModule.env);

	mockOnLCP.mockReset();
	mockOnINP.mockReset();
	mockOnCLS.mockReset();
	mockOnFCP.mockReset();
	mockOnTTFB.mockReset();
}

// Cleanup function for test environment
export function cleanupTestEnvironment() {
	if (_originalPerformanceObserver) {
		globalThis.PerformanceObserver = _originalPerformanceObserver;
	} else {
		delete (globalThis as { PerformanceObserver?: unknown }).PerformanceObserver;
	}
	_envSpy.mockRestore();
}

// Helper to get all metric handlers
export function getAllHandlers() {
	return {
		lcp: mockOnLCP.mock.calls[0]?.[0],
		inp: mockOnINP.mock.calls[0]?.[0],
		cls: mockOnCLS.mock.calls[0]?.[0],
		fcp: mockOnFCP.mock.calls[0]?.[0],
		ttfb: mockOnTTFB.mock.calls[0]?.[0],
	};
}

// Helper to call all handlers with sample metrics
export function callAllHandlers(handlers: ReturnType<typeof getAllHandlers>) {
	handlers.lcp?.(
		createMockMetric({ name: 'LCP', value: 2000, rating: RATING_GOOD, id: 'lcp-1', delta: 2000 })
	);
	handlers.inp?.(
		createMockMetric({ name: 'INP', value: 150, rating: RATING_GOOD, id: 'inp-1', delta: 150 })
	);
	handlers.cls?.(
		createMockMetric({ name: 'CLS', value: 0.1, rating: RATING_GOOD, id: 'cls-1', delta: 0.1 })
	);
	handlers.fcp?.(
		createMockMetric({ name: 'FCP', value: 1800, rating: RATING_GOOD, id: 'fcp-1', delta: 1800 })
	);
	handlers.ttfb?.(
		createMockMetric({ name: 'TTFB', value: 500, rating: RATING_GOOD, id: 'ttfb-1', delta: 500 })
	);
}

// Re-export for convenience

export { reportWebVitals } from '@core/perf/reportWebVitals';
export {
	createMockMetric,
	createMockPerformanceObserver,
	MESSAGE_WEB_VITAL_PREFIX,
	NAVIGATION_TYPE_NAVIGATE,
	RATING_GOOD,
	RATING_NEEDS_IMPROVEMENT,
} from '@tests/core/perf/reportWebVitals.helpers';
export { type MetricType } from 'web-vitals';
