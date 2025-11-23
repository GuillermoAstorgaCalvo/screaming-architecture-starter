/**
 * Metric-specific tests for reportWebVitals
 */

import {
	callAllHandlers,
	createMockMetric,
	getAllHandlers,
	getLogger,
	MESSAGE_WEB_VITAL_PREFIX,
	mockOnCLS,
	mockOnFCP,
	mockOnINP,
	mockOnLCP,
	mockOnTTFB,
	RATING_GOOD,
	RATING_NEEDS_IMPROVEMENT,
	reportWebVitals,
	setupProductionEnv,
	setupTestEnvironment,
} from '@tests/core/perf/reportWebVitals.setup';
import { beforeEach, describe, expect, it } from 'vitest';
import type { MetricType } from 'web-vitals';

function registerMetricHandlerRegistrationTests() {
	it('should register handlers for all metric types', async () => {
		await reportWebVitals(getLogger());

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
		await reportWebVitals(getLogger());

		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'LCP',
			value: 2000,
			rating: RATING_GOOD,
			id: 'lcp-1',
			delta: 2000,
		});

		lcpHandler(mockMetric);

		expect(getLogger().logs[0]).toMatchObject({
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
		await reportWebVitals(getLogger());

		const inpHandler = mockOnINP.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'INP',
			value: 150,
			rating: RATING_GOOD,
			id: 'inp-1',
			delta: 150,
		});

		inpHandler(mockMetric);

		expect(getLogger().logs[0]).toMatchObject({
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
		await reportWebVitals(getLogger());

		const clsHandler = mockOnCLS.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'CLS',
			value: 0.1,
			rating: RATING_GOOD,
			id: 'cls-1',
			delta: 0.1,
		});

		clsHandler(mockMetric);

		expect(getLogger().logs[0]).toMatchObject({
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
		await reportWebVitals(getLogger());

		const fcpHandler = mockOnFCP.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'FCP',
			value: 1800,
			rating: RATING_GOOD,
			id: 'fcp-1',
			delta: 1800,
		});

		fcpHandler(mockMetric);

		expect(getLogger().logs[0]).toMatchObject({
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
		await reportWebVitals(getLogger());

		const ttfbHandler = mockOnTTFB.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'TTFB',
			value: 500,
			rating: RATING_GOOD,
			id: 'ttfb-1',
			delta: 500,
		});

		ttfbHandler(mockMetric);

		expect(getLogger().logs[0]).toMatchObject({
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
		await reportWebVitals(getLogger());

		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];
		const ratings = ['good', 'needs-improvement', 'poor'] as const;

		for (const rating of ratings) {
			getLogger().reset();
			const mockMetric = createMockMetric({
				name: 'LCP',
				value: 3000,
				rating,
				id: `lcp-${rating}`,
				delta: 3000,
			});

			lcpHandler(mockMetric);
			expect(getLogger().logs[0]?.context?.rating).toBe(rating);
		}
	});
}

function registerNavigationTypeTests() {
	it('should handle all navigation types correctly', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];
		const navigationTypes = ['navigate', 'reload', 'back-forward', 'prerender'] as const;

		for (const navigationType of navigationTypes) {
			getLogger().reset();
			const mockMetric = createMockMetric({
				name: 'LCP',
				value: 2000,
				rating: RATING_GOOD,
				id: `lcp-${navigationType}`,
				delta: 2000,
				navigationType,
			});

			lcpHandler(mockMetric);
			expect(getLogger().logs[0]?.context?.navigationType).toBe(navigationType);
		}
	});

	it('should include navigationType when provided in metric', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'LCP',
			value: 2000,
			rating: RATING_GOOD,
			id: 'lcp-with-nav',
			delta: 2000,
			navigationType: 'reload',
		});

		lcpHandler(mockMetric);
		expect(getLogger().logs[0]?.context?.navigationType).toBe('reload');
	});
}

function registerZeroValueTest() {
	it('should handle zero values correctly', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const clsHandler = mockOnCLS.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'CLS',
			value: 0,
			rating: RATING_GOOD,
			id: 'cls-zero',
			delta: 0,
		});

		clsHandler(mockMetric);

		expect(getLogger().logs[0]?.context).toMatchObject({
			metric: 'CLS',
			value: 0,
			delta: 0,
		});
	});
}

function registerLargeValueTest() {
	it('should handle very large values correctly', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];
		const largeValue = 999999.99;
		const mockMetric = createMockMetric({
			name: 'LCP',
			value: largeValue,
			rating: RATING_NEEDS_IMPROVEMENT,
			id: 'lcp-large',
			delta: largeValue,
		});

		lcpHandler(mockMetric);

		expect(getLogger().logs[0]?.context).toMatchObject({
			metric: 'LCP',
			value: 1000000, // Rounded
			delta: 1000000, // Rounded
		});
	});
}

function registerRoundingBoundaryTest() {
	it('should round values at 0.5 boundary correctly', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const fcpHandler = mockOnFCP.mock.calls[0]?.[0];
		const testCases = [
			{ value: 1234.4, expected: 1234 },
			{ value: 1234.5, expected: 1235 },
			{ value: 1234.6, expected: 1235 },
		];

		for (const testCase of testCases) {
			getLogger().reset();
			const mockMetric = createMockMetric({
				name: 'FCP',
				value: testCase.value,
				rating: RATING_GOOD,
				id: `fcp-${testCase.value}`,
				delta: testCase.value,
			});

			fcpHandler(mockMetric);
			expect(getLogger().logs[0]?.context?.value).toBe(testCase.expected);
		}
	});
}

function registerDecimalPrecisionTest() {
	it('should handle decimal values with many decimal places', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const clsHandler = mockOnCLS.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'CLS',
			value: 0.123456789,
			rating: RATING_GOOD,
			id: 'cls-decimal',
			delta: 0.987654321,
		});

		clsHandler(mockMetric);

		expect(getLogger().logs[0]?.context).toMatchObject({
			metric: 'CLS',
			value: 0, // Rounded from 0.123456789
			delta: 1, // Rounded from 0.987654321
		});
	});
}

function registerEdgeCaseValueTests() {
	describe('edge case values', () => {
		registerZeroValueTest();
		registerLargeValueTest();
		registerRoundingBoundaryTest();
		registerDecimalPrecisionTest();
	});
}

function registerMultipleMetricReportsTests() {
	it('should handle multiple reports from the same metric type', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];
		const METRIC_REPORTS = 3;
		for (let i = 0; i < METRIC_REPORTS; i++) {
			const mockMetric = createMockMetric({
				name: 'LCP',
				value: 2000 + i * 100,
				rating: RATING_GOOD,
				id: `lcp-${i}`,
				delta: 2000 + i * 100,
			});

			lcpHandler(mockMetric);
		}

		expect(getLogger().logs).toHaveLength(METRIC_REPORTS);
		expect(getLogger().logs[0]?.context?.value).toBe(2000);
		expect(getLogger().logs[1]?.context?.value).toBe(2100);
		expect(getLogger().logs[2]?.context?.value).toBe(2200);
	});

	it('should handle metrics from all types being reported multiple times', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const handlers = getAllHandlers();
		const metricTypes = [
			{ handler: handlers.lcp, name: 'LCP', value: 2000 },
			{ handler: handlers.inp, name: 'INP', value: 150 },
			{ handler: handlers.cls, name: 'CLS', value: 0.1 },
			{ handler: handlers.fcp, name: 'FCP', value: 1800 },
			{ handler: handlers.ttfb, name: 'TTFB', value: 500 },
		];

		const REPORTS_PER_TYPE = 2;
		for (const metricType of metricTypes) {
			for (let i = 0; i < REPORTS_PER_TYPE; i++) {
				const mockMetric = createMockMetric({
					name: metricType.name as MetricType['name'],
					value: metricType.value + i,
					rating: RATING_GOOD,
					id: `${metricType.name.toLowerCase()}-${i}`,
					delta: metricType.value + i,
				});

				metricType.handler(mockMetric);
			}
		}

		const EXPECTED_LOGS = 10; // 5 types * 2 reports each
		expect(getLogger().logs).toHaveLength(EXPECTED_LOGS);
	});
}

function registerHandlerIsolationTests() {
	it('should isolate handlers so they do not interfere with each other', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const handlers = getAllHandlers();
		callAllHandlers(handlers);

		expect(getLogger().logs).toHaveLength(5);
		expect(getLogger().logs[0]?.context?.metric).toBe('LCP');
		expect(getLogger().logs[1]?.context?.metric).toBe('INP');
		expect(getLogger().logs[2]?.context?.metric).toBe('CLS');
		expect(getLogger().logs[3]?.context?.metric).toBe('FCP');
		expect(getLogger().logs[4]?.context?.metric).toBe('TTFB');
	});
}

function registerMetricDataCompletenessTests() {
	it('should not include entries array in formatted metric data', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const lcpHandler = mockOnLCP.mock.calls[0]?.[0];
		const mockMetric = createMockMetric({
			name: 'LCP',
			value: 2000,
			rating: RATING_GOOD,
			id: 'lcp-1',
			delta: 2000,
		});

		mockMetric.entries = [{ type: 'largest-contentful-paint' }] as never[];
		lcpHandler(mockMetric);

		expect(getLogger().logs[0]?.context).not.toHaveProperty('entries');
		expect(getLogger().logs[0]?.context).toHaveProperty('metric');
		expect(getLogger().logs[0]?.context).toHaveProperty('value');
		expect(getLogger().logs[0]?.context).toHaveProperty('rating');
		expect(getLogger().logs[0]?.context).toHaveProperty('id');
		expect(getLogger().logs[0]?.context).toHaveProperty('delta');
		expect(getLogger().logs[0]?.context).toHaveProperty('navigationType');
	});

	it('should include all required fields in formatted metric data', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const handlers = getAllHandlers();
		const metricConfigs = [
			{ name: 'LCP' as const, handler: handlers.lcp },
			{ name: 'INP' as const, handler: handlers.inp },
			{ name: 'CLS' as const, handler: handlers.cls },
			{ name: 'FCP' as const, handler: handlers.fcp },
			{ name: 'TTFB' as const, handler: handlers.ttfb },
		];

		for (const [index, config] of metricConfigs.entries()) {
			getLogger().reset();
			const mockMetric = createMockMetric({
				name: config.name,
				value: 1000,
				rating: RATING_GOOD,
				id: `test-${index}`,
				delta: 1000,
				navigationType: 'reload',
			});

			config.handler?.(mockMetric);

			const context = getLogger().logs[0]?.context;
			expect(context).toHaveProperty('metric', config.name);
			expect(context).toHaveProperty('value');
			expect(context).toHaveProperty('rating');
			expect(context).toHaveProperty('id');
			expect(context).toHaveProperty('delta');
			expect(context).toHaveProperty('navigationType');
		}
	});
}

function registerLoggerMethodTests() {
	it('should use getLogger().info for all metric reports', async () => {
		setupProductionEnv();
		await reportWebVitals(getLogger());

		const handlers = getAllHandlers();
		callAllHandlers(handlers);

		expect(getLogger().logs).toHaveLength(5);
		for (const log of getLogger().logs) {
			expect(log.level).toBe('info');
		}

		const levels = getLogger().logs.map(log => log.level);
		expect(levels).not.toContain('debug');
		expect(levels).not.toContain('warn');
		expect(levels).not.toContain('error');
	});
}

describe('core/perf/reportWebVitals - metrics', () => {
	beforeEach(() => {
		setupTestEnvironment();
		setupProductionEnv();
	});

	registerMetricHandlerRegistrationTests();
	registerLCPMetricTests();
	registerINPMetricTests();
	registerCLSMetricTests();
	registerFCPMetricTests();
	registerTTFBMetricTests();
	registerMetricRatingsTests();
	registerNavigationTypeTests();
	registerEdgeCaseValueTests();
	registerMultipleMetricReportsTests();
	registerHandlerIsolationTests();
	registerMetricDataCompletenessTests();
	registerLoggerMethodTests();
});
