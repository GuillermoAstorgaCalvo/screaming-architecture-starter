import type {
	AnalyticsEvent,
	AnalyticsIdentity,
	AnalyticsInitOptions,
	AnalyticsPageView,
	AnalyticsPort,
	AnalyticsUserProperties,
} from '@core/ports/AnalyticsPort';

type DataLayerPayload = Record<string, unknown>;

type GtmWindow = Window &
	Record<string, unknown> & {
		dataLayer?: DataLayerPayload[];
	};

const DEFAULT_DATALAYER_NAME = 'dataLayer';

function isBrowserEnvironment(): boolean {
	return typeof globalThis.window === 'object' && typeof globalThis.document === 'object';
}

/**
 * Google Tag Manager adapter implementing the AnalyticsPort interface.
 * Loads the GTM container, pushes events to the dataLayer, and defers vendor logic to GTM.
 */
export class GoogleTagManagerAdapter implements AnalyticsPort {
	private containerId: string | null = null;
	private dataLayerName: string = DEFAULT_DATALAYER_NAME;
	private initialized = false;
	private scriptLoaded = false;

	initialize(options: AnalyticsInitOptions): void {
		const containerId = options.containerId ?? options.writeKey ?? null;
		this.dataLayerName = options.dataLayerName ?? DEFAULT_DATALAYER_NAME;
		this.containerId = containerId;

		if (!isBrowserEnvironment() || !containerId) {
			this.initialized = false;
			return;
		}

		this.ensureGlobalDataLayer();
		this.pushToDataLayer({
			'gtm.start': Date.now(),
			event: 'gtm.js',
		});

		this.injectScript(containerId, Boolean(options.debug));
		this.initialized = true;
	}

	trackPageView(page: AnalyticsPageView): void {
		if (!this.canTrack()) {
			return;
		}

		this.pushToDataLayer({
			event: 'page_view',
			page_path: page.path,
			page_title: page.title,
			page_location: page.location,
		});
	}

	trackEvent(event: AnalyticsEvent): void {
		if (!this.canTrack()) {
			return;
		}

		this.pushToDataLayer({
			event: event.name,
			...event.params,
		});
	}

	identify(identity: AnalyticsIdentity): void {
		if (!this.canTrack() || (!identity.userId && !identity.traits)) {
			return;
		}

		const payload: DataLayerPayload = { event: 'identify' };

		if (identity.userId) {
			payload['user_id'] = identity.userId;
		}

		if (identity.traits) {
			payload['user_traits'] = identity.traits;
		}

		this.pushToDataLayer(payload);

		if (identity.traits) {
			this.setUserProperties(identity.traits);
		}
	}

	setUserProperties(properties: AnalyticsUserProperties): void {
		if (!this.canTrack() || Object.keys(properties).length === 0) {
			return;
		}

		this.pushToDataLayer({
			event: 'set_user_properties',
			user_properties: properties,
		});
	}

	reset(): void {
		if (!this.canTrack()) {
			return;
		}

		this.pushToDataLayer({
			event: 'reset_user',
		});
	}

	private ensureGlobalDataLayer(): void {
		const win = this.getWindow();
		if (!win) {
			return;
		}

		const dataLayerKey = this.dataLayerName;
		const existing = (win as Record<string, unknown>)[dataLayerKey];

		if (!Array.isArray(existing)) {
			(win as Record<string, unknown>)[dataLayerKey] = [];
		}
	}

	private injectScript(containerId: string, debug: boolean): void {
		if (!isBrowserEnvironment() || this.scriptLoaded) {
			return;
		}

		const scriptId = `gtm-script-${containerId}`;
		if (document.querySelector<HTMLScriptElement>(`script[id="${scriptId}"]`)) {
			this.scriptLoaded = true;
			return;
		}

		const script = this.createScriptElement(containerId, debug, scriptId);
		const firstScript = document.querySelector<HTMLScriptElement>('script');

		if (firstScript?.parentNode) {
			firstScript.parentNode.insertBefore(script, firstScript);
		} else {
			document.head.append(script);
		}

		this.scriptLoaded = true;
	}

	private createScriptElement(
		containerId: string,
		debug: boolean,
		scriptId: string
	): HTMLScriptElement {
		const script = document.createElement('script');
		script.async = true;

		const searchParams = new URLSearchParams({
			id: containerId,
		});

		if (this.dataLayerName !== DEFAULT_DATALAYER_NAME) {
			searchParams.set('l', this.dataLayerName);
		}

		if (debug) {
			searchParams.set('gtm_debug', 'x');
		}

		script.src = `https://www.googletagmanager.com/gtm.js?${searchParams.toString()}`;
		script.id = scriptId;

		return script;
	}

	private pushToDataLayer(payload: DataLayerPayload): void {
		const dataLayer = this.getDataLayer();
		if (!dataLayer) {
			return;
		}

		dataLayer.push(payload);
	}

	private getDataLayer(): DataLayerPayload[] | null {
		const win = this.getWindow();
		if (!win) {
			return null;
		}

		const dataLayerKey = this.dataLayerName;
		const dataLayer = (win as Record<string, unknown>)[dataLayerKey];

		if (!Array.isArray(dataLayer)) {
			return null;
		}

		return dataLayer as DataLayerPayload[];
	}

	private canTrack(): boolean {
		return this.initialized && Boolean(this.containerId);
	}

	private getWindow(): GtmWindow | null {
		if (!isBrowserEnvironment()) {
			return null;
		}

		return globalThis.window as unknown as GtmWindow;
	}
}

export const googleTagManagerAdapter = new GoogleTagManagerAdapter();

export const noopAnalyticsAdapter: AnalyticsPort = {
	initialize: () => undefined,
	trackPageView: () => undefined,
	trackEvent: () => undefined,
	identify: () => undefined,
	setUserProperties: () => undefined,
	reset: () => undefined,
};
