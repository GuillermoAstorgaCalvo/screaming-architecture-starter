import type {
	AnalyticsEvent,
	AnalyticsIdentity,
	AnalyticsInitOptions,
	AnalyticsPageView,
	AnalyticsPort,
	AnalyticsUserProperties,
} from '@core/ports/AnalyticsPort';

const noop = () => undefined;

export const noopAnalyticsAdapter: AnalyticsPort = {
	initialize: (_config: AnalyticsInitOptions) => undefined,
	trackPageView: (_page: AnalyticsPageView) => undefined,
	trackEvent: (_event: AnalyticsEvent) => undefined,
	identify: (_identity: AnalyticsIdentity) => undefined,
	setUserProperties: (_properties: AnalyticsUserProperties) => undefined,
	reset: noop,
};
