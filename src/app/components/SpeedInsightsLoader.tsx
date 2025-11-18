import { env } from '@core/config/env.client';
import { type ComponentType, useEffect, useState } from 'react';

/**
 * Lazily loads the Vercel Speed Insights component so that the analytics
 * bundle is only fetched in production builds when the feature flag is enabled.
 */
export function SpeedInsightsLoader() {
	const [SpeedInsights, setSpeedInsights] = useState<ComponentType | null>(null);

	useEffect(() => {
		let isMounted = true;

		const loadSpeedInsights = async () => {
			try {
				const module = await import('@vercel/speed-insights/react');
				if (isMounted) {
					setSpeedInsights(() => module.SpeedInsights);
				}
			} catch (error) {
				if (env.DEV) {
					console.warn('Failed to load Speed Insights', error);
				}
			}
		};

		loadSpeedInsights().catch(error => {
			if (env.DEV) {
				console.error('Unexpected Speed Insights error', error);
			}
		});

		return () => {
			isMounted = false;
		};
	}, []);

	if (!SpeedInsights) {
		return null;
	}

	return <SpeedInsights />;
}
