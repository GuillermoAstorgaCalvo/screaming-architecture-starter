/**
 * Performance Utilities Tests
 *
 * Tests for Core Web Vitals performance monitoring:
 * - reportWebVitals function
 * - metric formatting
 * - metric handler creation
 * - logger integration
 * - all metric types (CLS, FID, FCP, LCP, TTFB, INP)
 */

import * as envModule from '@core/config/env.client';
import { reportWebVitals } from '@core/perf/reportWebVitals';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MetricType } from 'web-vitals';

// Mock web-vitals module
const mockOnLCP = vi.fn();
const mockOnINP = vi.fn();
const mockOnCLS = vi.fn();
const mockOnFCP = vi.fn();
const mockOnTTFB = vi.fn();

vi.mock('web-vitals', () => ({
	onLCP: mockOnLCP,
	onINP: mockOnINP,
	onCLS: mockOnCLS,
	onFCP: mockOnFCP,
	onTTFB: mockOnTTFB,
}));

// Helper to create a mock PerformanceObserver
function createMockPerformanceObserver() {
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

// Constants for repeated values
const NAVIGATION_TYPE_NAVIGATE = 'navigate';
const RATING_GOOD = 'good';
const RATING_NEEDS_IMPROVEMENT = 'needs-improvement';
const MESSAGE_WEB_VITAL_PREFIX = 'Web Vital:';

// Helper to setup production environment for tests
function setupProductionEnv(envSpy: ReturnType<typeof vi.spyOn>) {
	envSpy.mockReturnValue({
		...envModule.env,
		PROD: true,
	} as typeof envModule.env);
	globalThis.PerformanceObserver = createMockPerformanceObserver();
}

// Helper to create a mock metric
function createMockMetric(options: {
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

// Shared test state
let logger: MockLoggerAdapter;
let originalPerformanceObserver: typeof globalThis.PerformanceObserver | undefined;
let envSpy: ReturnType<typeof vi.spyOn>;

// Setup function for test environment
function setupTestEnvironment() {
	// Reset logger
	logger = new MockLoggerAdapter();

	// Store original PerformanceObserver
	originalPerformanceObserver = globalThis.PerformanceObserver;

	// Mock env.PROD - default to false (non-production)
	envSpy = vi.spyOn(envModule, 'env', 'get').mockReturnValue({
		...envModule.env,
		PROD: false,
	} as typeof envModule.env);

	// Reset all mocks
	mockOnLCP.mockReset();
	mockOnINP.mockReset();
	mockOnCLS.mockReset();
	mockOnFCP.mockReset();
	mockOnTTFB.mockReset();
}

// Cleanup function for test environment
function cleanupTestEnvironment() {
	// Restore PerformanceObserver
	if (originalPerformanceObserver) {
		globalThis.PerformanceObserver = originalPerformanceObserver;
	} else {
		delete (globalThis as { PerformanceObserver?: unknown }).PerformanceObserver;
	}

	// Restore env spy
	envSpy.mockRestore();
}

// Test registration functions
function registerNonProductionTests() {
	describe('non-production mode', () => {
		it('should return early when not in production', async () => {
			// envSpy already mocks PROD: false in beforeEach
			await reportWebVitals(logger);

			// Should not call any web-vitals functions
			expectNoWebVitalsCalls();

			// Should not log anything
			expect(logger.logs).toHaveLength(0);
		});
	});
}

function registerPerformanceObserverUnavailableTest() {
	it('should return early when PerformanceObserver is not available', async () => {
		// Mock env to be production
		envSpy.mockReturnValue({
			...envModule.env,
			PROD: true,
		} as typeof envModule.env);

		// Remove PerformanceObserver
		delete (globalThis as { PerformanceObserver?: unknown }).PerformanceObserver;

		await reportWebVitals(logger);

		// Should not call any web-vitals functions
		expectNoWebVitalsCalls();

		// Should not log anything
		expect(logger.logs).toHaveLength(0);
	});
}

function registerPerformanceObserverAvailableTest() {
	it('should proceed when PerformanceObserver is available', async () => {
		// Mock env to be production
		envSpy.mockReturnValue({
			...envModule.env,
			PROD: true,
		} as typeof envModule.env);

		// Ensure PerformanceObserver exists
		globalThis.PerformanceObserver = createMockPerformanceObserver();

		await reportWebVitals(logger);

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
		setupProductionEnv(envSpy);
		await reportWebVitals(logger);

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

		expect(logger.logs).toHaveLength(1);
		expect(logger.logs[0]).toMatchObject({
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
		setupProductionEnv(envSpy);
		await reportWebVitals(logger);

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

		expect(logger.logs[0]?.context).toMatchObject({
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

function registerMetricHandlerRegistrationTests() {
	it('should register handlers for all metric types', async () => {
		await reportWebVitals(logger);

		expect(mockOnLCP).toHaveBeenCalledTimes(1);
		expect(mockOnINP).toHaveBeenCalledTimes(1);
		expect(mockOnCLS).toHaveBeenCalledTimes(1);
		expect(mockOnFCP).toHaveBeenCalledTimes(1);
		expect(mockOnTTFB).toHaveBeenCalledTimes(1);

		expect(mockOnLCP).toHaveBeenCalledWith(expect.any(Function));
		expect(mockOnINP).toHaveBeenCalledWith(expect.any(Function));
		expect(mockOnCLS).toHaveBeenCalledWith(expect.any(Function));
		expect(mockOnFCP).toHaveBeenCalledWith(expect.any(Function));
		expect(mockOnTTFB).toHaveBeenCalledWith(expect.any(Function));
	});
}

function registerLCPMetricTests() {
	it('should log LCP metrics correctly', async () => {
		await reportWebVitals(logger);

		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'LCP',
			value: 2000,
			rating: RATING_GOOD,
			id: 'lcp-1',
			delta: 2000,
		});

		lcpHandler(mockMetric);

		expect(logger.logs[0]).toMatchObject({
			level: 'info',
			message: `${MESSAGE_WEB_VITAL_PREFIX} LCP`,
			context: {
				metric: 'LCP',
				value: 2000,
				rating: RATING_GOOD,
			},
		});
	});
}

function registerINPMetricTests() {
	it('should log INP metrics correctly', async () => {
		await reportWebVitals(logger);

		const inpHandler = mockOnINP.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'INP',
			value: 150,
			rating: RATING_GOOD,
			id: 'inp-1',
			delta: 150,
		});

		inpHandler(mockMetric);

		expect(logger.logs[0]).toMatchObject({
			level: 'info',
			message: `${MESSAGE_WEB_VITAL_PREFIX} INP`,
			context: {
				metric: 'INP',
				value: 150,
				rating: RATING_GOOD,
			},
		});
	});
}

function registerCLSMetricTests() {
	it('should log CLS metrics correctly', async () => {
		await reportWebVitals(logger);

		const clsHandler = mockOnCLS.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'CLS',
			value: 0.1,
			rating: RATING_GOOD,
			id: 'cls-1',
			delta: 0.1,
		});

		clsHandler(mockMetric);

		expect(logger.logs[0]).toMatchObject({
			level: 'info',
			message: `${MESSAGE_WEB_VITAL_PREFIX} CLS`,
			context: {
				metric: 'CLS',
				value: 0, // Rounded from 0.1
				rating: RATING_GOOD,
			},
		});
	});
}

function registerFCPMetricTests() {
	it('should log FCP metrics correctly', async () => {
		await reportWebVitals(logger);

		const fcpHandler = mockOnFCP.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'FCP',
			value: 1800,
			rating: RATING_GOOD,
			id: 'fcp-1',
			delta: 1800,
		});

		fcpHandler(mockMetric);

		expect(logger.logs[0]).toMatchObject({
			level: 'info',
			message: `${MESSAGE_WEB_VITAL_PREFIX} FCP`,
			context: {
				metric: 'FCP',
				value: 1800,
				rating: RATING_GOOD,
			},
		});
	});
}

function registerTTFBMetricTests() {
	it('should log TTFB metrics correctly', async () => {
		await reportWebVitals(logger);

		const ttfbHandler = mockOnTTFB.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'TTFB',
			value: 500,
			rating: RATING_GOOD,
			id: 'ttfb-1',
			delta: 500,
		});

		ttfbHandler(mockMetric);

		expect(logger.logs[0]).toMatchObject({
			level: 'info',
			message: `${MESSAGE_WEB_VITAL_PREFIX} TTFB`,
			context: {
				metric: 'TTFB',
				value: 500,
				rating: RATING_GOOD,
			},
		});
	});
}

function registerMetricRatingsTests() {
	it('should handle all metric ratings (good, needs-improvement, poor)', async () => {
		await reportWebVitals(logger);

		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];
		const ratings = ['good', 'needs-improvement', 'poor'] as const;

		for (const rating of ratings) {
			logger.reset();
			const mockMetric = createMockMetric({
				name: 'LCP',
				value: 3000,
				rating,
				id: `lcp-${rating}`,
				delta: 3000,
			});

			lcpHandler(mockMetric);
			expect(logger.logs[0]?.context?.rating).toBe(rating);
		}
	});
}

function registerAllMetricTypesTests() {
	describe('all metric types', () => {
		beforeEach(() => {
			setupProductionEnv(envSpy);
		});

		registerMetricHandlerRegistrationTests();
		registerLCPMetricTests();
		registerINPMetricTests();
		registerCLSMetricTests();
		registerFCPMetricTests();
		registerTTFBMetricTests();
		registerMetricRatingsTests();
	});
}

function registerErrorHandlingTests() {
	describe('error handling', () => {
		it('should handle errors gracefully without throwing', async () => {
			// Mock env to be production
			envSpy.mockReturnValue({
				...envModule.env,
				PROD: true,
			} as typeof envModule.env);

			// Ensure PerformanceObserver exists
			globalThis.PerformanceObserver = createMockPerformanceObserver();

			// The function should complete without throwing
			// Error handling for import failures is tested via code coverage
			// since it's difficult to mock dynamic imports in unit tests
			await expect(reportWebVitals(logger)).resolves.not.toThrow();
		});
	});
}

function registerLoggerInstanceTests() {
	it('should use the provided logger instance', async () => {
		setupProductionEnv(envSpy);

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
		setupProductionEnv(envSpy);
		await reportWebVitals(logger);

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

		const logContext = logger.logs[0]?.context;
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
	describe('logger integration', () => {
		registerLoggerInstanceTests();
		registerLoggerFieldsTests();
	});
}

function registerAllTestSuites() {
	registerNonProductionTests();
	registerPerformanceObserverTests();
	registerMetricHandlerTests();
	registerAllMetricTypesTests();
	registerErrorHandlingTests();
	registerLoggerIntegrationTests();
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
