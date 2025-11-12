/**
 * Core Web Vitals Performance Monitoring
 *
 * Tracks and reports Core Web Vitals metrics in production:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay) - Note: deprecated, use INP instead
 * - INP (Interaction to Next Paint) - Modern replacement for FID
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 *
 * Only runs in production mode to avoid noise in development.
 * Metrics are logged using the provided logger, which can be extended
 * to send to analytics services (e.g., Google Analytics, Sentry, etc.).
 *
 * See: https://web.dev/vitals/
 */

import { env } from '@core/config/env.client';
import type { LoggerPort } from '@core/ports/LoggerPort';
import { type MetricType, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

/**
 * Format metric data for logging
 * Uses the rating provided by web-vitals library (based on Google's thresholds)
 */
function formatMetricData(metric: MetricType) {
	return {
		metric: metric.name,
		value: Math.round(metric.value),
		rating: metric.rating,
		id: metric.id,
		delta: Math.round(metric.delta),
		// Include navigation type (always present on all metrics in web-vitals v5)
		navigationType: metric.navigationType,
	};
}

/**
 * Create metric handler for web vitals
 */
function createMetricHandler(vitalName: string, logger: LoggerPort) {
	return (metric: MetricType) => {
		const data = formatMetricData(metric);
		logger.info(`Web Vital: ${vitalName}`, data);
	};
}

/**
 * Report Web Vitals metrics
 * Only runs in production mode
 *
 * @param logger - LoggerPort instance for logging metrics (required)
 */
export function reportWebVitals(logger: LoggerPort): void {
	// Only track in production
	if (!env.PROD) {
		return;
	}

	// Check if Performance API is available
	if (!('PerformanceObserver' in globalThis)) {
		return;
	}

	try {
		onLCP(createMetricHandler('LCP', logger));
		onINP(createMetricHandler('INP', logger));
		onCLS(createMetricHandler('CLS', logger));
		onFCP(createMetricHandler('FCP', logger));
		onTTFB(createMetricHandler('TTFB', logger));
	} catch (error) {
		// Silently fail if web-vitals library fails to initialize
		// This prevents performance monitoring from breaking the app
		logger.warn('Failed to initialize Web Vitals tracking', {
			error: error instanceof Error ? error.message : String(error),
		});
	}
}
