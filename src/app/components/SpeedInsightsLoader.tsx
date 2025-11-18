import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';

/**
 * Lazily loads the Vercel Speed Insights component so that the analytics
 * bundle is only fetched in production builds when the feature flag is enabled.
 */
export function SpeedInsightsLoader() {
	const [SpeedInsights, setSpeedInsights] = useState<ComponentType | null>(null);

	useEffect(() => {
		let isMounted = true;

		void import('@vercel/speed-insights/react')
			.then(module => {
				if (isMounted) {
					setSpeedInsights(() => module.SpeedInsights);
				}
			})
			.catch(error => {
				if (import.meta.env.DEV) {
					console.warn('Failed to load Speed Insights', error);
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
