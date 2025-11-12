import type {
	AnalyticsEvent,
	AnalyticsIdentity,
	AnalyticsInitOptions,
	AnalyticsPageView,
	AnalyticsPort,
	AnalyticsUserProperties,
} from '@core/ports/AnalyticsPort';

type GtagCommandArguments = [command: string, ...args: unknown[]];

type GtagFunction = (...args: GtagCommandArguments) => void;

interface GtagWindow extends Window {
	gtag?: GtagFunction;
	[key: string]: unknown;
}

const DEFAULT_DATALAYER_NAME = 'dataLayer';

function isBrowserEnvironment(): boolean {
	return typeof globalThis.window === 'object' && typeof globalThis.document === 'object';
}

/**
 * Google Analytics adapter implementing the AnalyticsPort interface.
 * Uses gtag.js (GA4) under the hood.
 */
class GoogleAnalyticsAdapter implements AnalyticsPort {
	private measurementId: string | null = null;
	private dataLayerName: string = DEFAULT_DATALAYER_NAME;
	private initialized = false;
	private scriptLoaded = false;

	initialize(options: AnalyticsInitOptions): void {
		const writeKey = options.writeKey ?? null;
		this.dataLayerName = options.dataLayerName ?? DEFAULT_DATALAYER_NAME;
		this.measurementId = writeKey;

		if (!isBrowserEnvironment() || !writeKey) {
			this.initialized = false;
			return;
		}

		this.ensureGlobalDataLayer();
		this.injectScript(writeKey);

		this.callGtag('js', new Date());
		this.callGtag('config', writeKey, {
			send_page_view: false,
			debug_mode: Boolean(options.debug),
		});

		this.initialized = true;
	}

	trackPageView(page: AnalyticsPageView): void {
		if (!this.canTrack()) {
			return;
		}

		this.callGtag('event', 'page_view', {
			page_path: page.path,
			page_title: page.title,
			page_location: page.location,
		});
	}

	trackEvent(event: AnalyticsEvent): void {
		if (!this.canTrack()) {
			return;
		}

		this.callGtag('event', event.name, event.params ?? {});
	}

	identify(identity: AnalyticsIdentity): void {
		if (!this.canTrack() || (!identity.userId && !identity.traits)) {
			return;
		}

		if (identity.userId) {
			this.callGtag('set', { user_id: identity.userId });
		}

		if (identity.traits) {
			this.setUserProperties(identity.traits);
		}
	}

	setUserProperties(properties: AnalyticsUserProperties): void {
		if (!this.canTrack() || Object.keys(properties).length === 0) {
			return;
		}

		this.callGtag('set', 'user_properties', properties);
	}

	reset(): void {
		if (!this.canTrack()) {
			return;
		}

		this.callGtag('set', { user_id: null });
		this.callGtag('set', 'user_properties', {});
	}

	private ensureGlobalDataLayer(): void {
		const win = this.getWindow();
		if (!win) {
			return;
		}

		const dataLayerKey = this.dataLayerName;

		if (!Array.isArray((win as Record<string, unknown>)[dataLayerKey])) {
			(win as Record<string, unknown>)[dataLayerKey] = [];
		}

		const dataLayer = (win as Record<string, unknown>)[dataLayerKey] as unknown[];

		if (typeof win.gtag !== 'function') {
			win.gtag = (...args: GtagCommandArguments) => {
				dataLayer.push(args);
			};
		}
	}

	private injectScript(measurementId: string): void {
		if (!isBrowserEnvironment() || this.scriptLoaded) {
			return;
		}

		const scriptId = `ga-gtag-${measurementId}`;
		if (document.querySelector<HTMLScriptElement>(`script[id="${scriptId}"]`)) {
			this.scriptLoaded = true;
			return;
		}

		const script = this.createScriptElement(measurementId, scriptId);
		const headElement = document.querySelector<HTMLHeadElement>('head');

		if (!headElement) {
			return;
		}

		headElement.append(script);
		this.scriptLoaded = true;
	}

	private callGtag(...args: GtagCommandArguments): void {
		const win = this.getWindow();
		if (!win || typeof win.gtag !== 'function') {
			return;
		}

		win.gtag(...args);
	}

	private createScriptElement(measurementId: string, scriptId: string): HTMLScriptElement {
		const script = document.createElement('script');
		script.async = true;

		const searchParams = new URLSearchParams({
			id: measurementId,
		});

		if (this.dataLayerName !== DEFAULT_DATALAYER_NAME) {
			searchParams.set('l', this.dataLayerName);
		}

		script.src = `https://www.googletagmanager.com/gtag/js?${searchParams.toString()}`;
		script.id = scriptId;

		return script;
	}

	private canTrack(): boolean {
		return this.initialized && Boolean(this.measurementId);
	}

	private getWindow(): GtagWindow | null {
		if (!isBrowserEnvironment()) {
			return null;
		}

		return globalThis.window as unknown as GtagWindow;
	}
}

export const googleAnalyticsAdapter = new GoogleAnalyticsAdapter();

export type { GoogleAnalyticsAdapter };

export const noopAnalyticsAdapter: AnalyticsPort = {
	initialize: () => undefined,
	trackPageView: () => undefined,
	trackEvent: () => undefined,
	identify: () => undefined,
	setUserProperties: () => undefined,
	reset: () => undefined,
};
