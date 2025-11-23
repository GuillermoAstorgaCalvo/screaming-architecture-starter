/**
 * Performance Utilities Tests
 *
 * Tests for Core Web Vitals performance monitoring:
 * - reportWebVitals function
 * - metric formatting
 * - metric handler creation
 * - getLogger() integration
 * - all metric types (CLS, FID, FCP, LCP, TTFB, INP)
 */

import { reportWebVitals } from '@core/perf/reportWebVitals';
import {
	createMockMetric,
	MESSAGE_WEB_VITAL_PREFIX,
	NAVIGATION_TYPE_NAVIGATE,
	RATING_GOOD,
	RATING_NEEDS_IMPROVEMENT,
} from '@tests/core/perf/reportWebVitals.helpers';
import {
	cleanupTestEnvironment,
	getLogger,
	mockOnCLS,
	mockOnFCP,
	mockOnINP,
	mockOnLCP,
	mockOnTTFB,
	setupProductionEnv,
	setupTestEnvironment,
} from '@tests/core/perf/reportWebVitals.setup';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// Helper to assert all web-vitals functions were not called
function expectNoWebVitalsCalls() {
	expect(mockOnLCP).not.toHaveBeenCalled();
	expect(mockOnINP).not.toHaveBeenCalled();
	expect(mockOnCLS).not.toHaveBeenCalled();
	expect(mockOnFCP).not.toHaveBeenCalled();
	expect(mockOnTTFB).not.toHaveBeenCalled();
}

// Helper to assert all web-vitals functions were called
function expectAllWebVitalsCalls() {
	expect(mockOnLCP).toHaveBeenCalled();
	expect(mockOnINP).toHaveBeenCalled();
	expect(mockOnCLS).toHaveBeenCalled();
	expect(mockOnFCP).toHaveBeenCalled();
	expect(mockOnTTFB).toHaveBeenCalled();
}

// Test registration functions
function registerNonProductionTests() {
	describe('non-production mode', () => {
		it('should return early when not in production', async () => {
			// envSpy already mocks PROD: false in beforeEach
			await reportWebVitals(getLogger());

			// Should not call any web-vitals functions
			expectNoWebVitalsCalls();

			// Should not log anything
			expect(getLogger().logs).toHaveLength(0);
		});
	});
}

function registerPerformanceObserverUnavailableTest() {
	it('should return early when PerformanceObserver is not available', async () => {
		setupProductionEnv();

		// Remove PerformanceObserver
		delete (globalThis as { PerformanceObserver?: unknown }).PerformanceObserver;

		await reportWebVitals(getLogger());

		// Should not call any web-vitals functions
		expectNoWebVitalsCalls();

		// Should not log anything
		expect(getLogger().logs).toHaveLength(0);
	});
}

function registerPerformanceObserverAvailableTest() {
	it('should proceed when PerformanceObserver is available', async () => {
		setupProductionEnv();

		await reportWebVitals(getLogger());

		// Should call all web-vitals functions
		expectAllWebVitalsCalls();
	});
}

function registerPerformanceObserverTests() {
	describe('PerformanceObserver availability', () => {
		registerPerformanceObserverUnavailableTest();
		registerPerformanceObserverAvailableTest();
	});
}

function registerHandlerFormattingTests() {
	it('should create handlers that format and log metrics correctly', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		expect(mockOnLCP).toHaveBeenCalledWith(expect.any(Function));
		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];

		const mockMetric = createMockMetric({
			name: 'LCP',
			value: 1234.567,
			rating: RATING_GOOD,
			id: 'test-id-123',
			delta: 1234.567,
		});

		lcpHandler(mockMetric);

		expect(getLogger().logs).toHaveLength(1);
		expect(getLogger().logs[0]).toMatchObject({
			level: 'info',
			message: `${MESSAGE_WEB_VITAL_PREFIX} LCP`,
			context: {
				metric: 'LCP',
				value: 1235, // Rounded
				rating: RATING_GOOD,
				id: 'test-id-123',
				delta: 1235, // Rounded
				navigationType: NAVIGATION_TYPE_NAVIGATE,
			},
		});
	});
}

function registerHandlerRoundingTests() {
	it('should format metric values by rounding', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		expect(mockOnFCP).toHaveBeenCalledWith(expect.any(Function));
		const fcpHandler = mockOnFCP.mock.calls[0]?.[0];

		const mockMetric = createMockMetric({
			name: 'FCP',
			value: 1234.9,
			rating: RATING_NEEDS_IMPROVEMENT,
			id: 'fcp-id',
			delta: 1234.1,
			navigationType: 'reload',
		});

		fcpHandler(mockMetric);

		expect(getLogger().logs[0]?.context).toMatchObject({
			value: 1235, // Rounded up
			delta: 1234, // Rounded down
		});
	});
}

function registerMetricHandlerTests() {
	describe('metric handler creation', () => {
		registerHandlerFormattingTests();
		registerHandlerRoundingTests();
	});
}

function registerConcurrentCallsTests() {
	it('should handle concurrent calls to reportWebVitals', async () => {
		setupProductionEnv();

		await Promise.all([
			reportWebVitals(getLogger()),
			reportWebVitals(getLogger()),
			reportWebVitals(getLogger()),
		]);

		expect(mockOnLCP).toHaveBeenCalled();
		expect(mockOnINP).toHaveBeenCalled();
		expect(mockOnCLS).toHaveBeenCalled();
		expect(mockOnFCP).toHaveBeenCalled();
		expect(mockOnTTFB).toHaveBeenCalled();

		expect(getLogger().logs.filter(log => log.level === 'error')).toHaveLength(0);
	});

	it('should work correctly when called multiple times sequentially', async () => {
		setupProductionEnv();

		const SEQUENTIAL_CALLS = 3;
		await reportWebVitals(getLogger());
		await reportWebVitals(getLogger());
		await reportWebVitals(getLogger());

		expect(mockOnLCP).toHaveBeenCalledTimes(SEQUENTIAL_CALLS);
		expect(mockOnINP).toHaveBeenCalledTimes(SEQUENTIAL_CALLS);
		expect(mockOnCLS).toHaveBeenCalledTimes(SEQUENTIAL_CALLS);
		expect(mockOnFCP).toHaveBeenCalledTimes(SEQUENTIAL_CALLS);
		expect(mockOnTTFB).toHaveBeenCalledTimes(SEQUENTIAL_CALLS);
	});
}

function registerErrorHandlingTests() {
	describe('error handling', () => {
		it('should handle errors gracefully without throwing', async () => {
			setupProductionEnv();

			// The function should complete without throwing
			await expect(reportWebVitals(getLogger())).resolves.not.toThrow();
		});
	});
}

function registerLoggerInstanceTests() {
	it('should use the provided getLogger() instance', async () => {
		setupProductionEnv();

		const customLogger = new MockLoggerAdapter();
		await reportWebVitals(customLogger);

		expect(mockOnLCP).toHaveBeenCalledWith(expect.any(Function));

		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];
		expect(lcpHandler).toBeDefined();
		expect(typeof lcpHandler).toBe('function');

		const mockMetric = createMockMetric({
			name: 'LCP',
			value: 2000,
			rating: RATING_GOOD,
			id: 'test',
			delta: 2000,
		});

		lcpHandler(mockMetric);

		expect(customLogger.logs).toHaveLength(1);
		expect(customLogger.logs[0]?.message).toBe(`${MESSAGE_WEB_VITAL_PREFIX} LCP`);
	});
}

function registerLoggerFieldsTests() {
	it('should log metrics with all required fields', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		expect(mockOnLCP).toHaveBeenCalledWith(expect.any(Function));
		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];
		expect(lcpHandler).toBeDefined();
		expect(typeof lcpHandler).toBe('function');

		const mockMetric = createMockMetric({
			name: 'LCP',
			value: 2500.75,
			rating: RATING_NEEDS_IMPROVEMENT,
			id: 'lcp-complete',
			delta: 2500.25,
			navigationType: 'back-forward',
		});

		lcpHandler(mockMetric);

		const logContext = getLogger().logs[0]?.context;
		expect(logContext).toHaveProperty('metric');
		expect(logContext).toHaveProperty('value');
		expect(logContext).toHaveProperty('rating');
		expect(logContext).toHaveProperty('id');
		expect(logContext).toHaveProperty('delta');
		expect(logContext).toHaveProperty('navigationType');

		expect(logContext).toEqual({
			metric: 'LCP',
			value: 2501, // Rounded
			rating: RATING_NEEDS_IMPROVEMENT,
			id: 'lcp-complete',
			delta: 2500, // Rounded
			navigationType: 'back-forward',
		});
	});
}

function registerLoggerIntegrationTests() {
	describe('getLogger() integration', () => {
		registerLoggerInstanceTests();
		registerLoggerFieldsTests();
	});
}

function registerAllTestSuites() {
	registerNonProductionTests();
	registerPerformanceObserverTests();
	registerMetricHandlerTests();
	registerLoggerIntegrationTests();
	registerConcurrentCallsTests();
	// Register error handling tests last to avoid affecting other tests with module resets
	registerErrorHandlingTests();
}

describe('core/perf/reportWebVitals', () => {
	beforeEach(() => {
		setupTestEnvironment();
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	registerAllTestSuites();
});
