import type { AnalyticsPort } from '@core/ports/AnalyticsPort';
import { AnalyticsContext } from '@core/providers/analytics/AnalyticsContext';
import { useContext } from 'react';

/**
 * Hook to access AnalyticsPort from context
 * @returns AnalyticsPort implementation
 * @throws Error if used outside AnalyticsProvider
 */
export function useAnalytics(): AnalyticsPort {
	const context = useContext(AnalyticsContext);

	if (context === undefined) {
		throw new Error('useAnalytics must be used within an AnalyticsProvider');
	}

	return context;
}
