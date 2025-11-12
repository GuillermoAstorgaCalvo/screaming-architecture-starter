import type {
	AnalyticsEvent,
	AnalyticsIdentity,
	AnalyticsInitOptions,
	AnalyticsPageView,
	AnalyticsPort,
	AnalyticsUserProperties,
} from '@core/ports/AnalyticsPort';

export class MockAnalyticsAdapter implements AnalyticsPort {
	public initializedWith: AnalyticsInitOptions | null = null;
	public pageViews: AnalyticsPageView[] = [];
	public events: AnalyticsEvent[] = [];
	public identities: AnalyticsIdentity[] = [];
	public userProperties: AnalyticsUserProperties[] = [];
	public resetCount = 0;

	initialize(options: AnalyticsInitOptions): void {
		this.initializedWith = options;
	}

	trackPageView(page: AnalyticsPageView): void {
		this.pageViews.push(page);
	}

	trackEvent(event: AnalyticsEvent): void {
		this.events.push(event);
	}

	identify(identity: AnalyticsIdentity): void {
		this.identities.push(identity);
	}

	setUserProperties(properties: AnalyticsUserProperties): void {
		this.userProperties.push(properties);
	}

	reset(): void {
		this.resetCount += 1;
	}

	clear(): void {
		this.initializedWith = null;
		this.pageViews = [];
		this.events = [];
		this.identities = [];
		this.userProperties = [];
		this.resetCount = 0;
	}
}
