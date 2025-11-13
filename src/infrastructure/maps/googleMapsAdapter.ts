/**
 * Google Maps adapter for loading and initializing Google Maps JavaScript API
 *
 * Handles dynamic script loading and provides utilities for working with Google Maps.
 * Follows the same pattern as the analytics adapter for consistency.
 */

interface GoogleMapsWindow extends Window {
	google?: {
		maps: typeof google.maps;
	};
	[key: string]: unknown;
}

type GoogleMapsCallback = () => void;

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';
const GOOGLE_MAPS_API_BASE_URL = 'https://maps.googleapis.com/maps/api/js';

function isBrowserEnvironment(): boolean {
	return typeof globalThis.window === 'object' && typeof globalThis.document === 'object';
}

/**
 * Google Maps adapter for script loading and initialization
 */
export class GoogleMapsAdapter {
	private apiKey: string | null = null;
	private scriptLoaded = false;
	private scriptLoading = false;
	private loadCallbacks: GoogleMapsCallback[] = [];
	private libraries: string[] = [];

	/**
	 * Initialize Google Maps with API key
	 * @param apiKey - Google Maps API key
	 * @param libraries - Optional array of Google Maps libraries to load (e.g., ['places', 'geometry'])
	 */
	async initialize(apiKey: string, libraries: string[] = []): Promise<void> {
		if (!isBrowserEnvironment() || !apiKey) {
			return;
		}

		this.apiKey = apiKey;
		// Automatically include 'marker' library for Advanced Markers support
		const markerLibrary = 'marker';
		this.libraries = libraries.includes(markerLibrary) ? libraries : [...libraries, markerLibrary];

		// If script is already loaded, resolve immediately
		if (this.scriptLoaded && this.isGoogleMapsAvailable()) {
			return;
		}

		// If script is currently loading, wait for it
		if (this.scriptLoading) {
			return new Promise<void>(resolve => {
				this.loadCallbacks.push(resolve);
			});
		}

		// Start loading the script
		this.scriptLoading = true;
		return this.loadScript();
	}

	/**
	 * Check if Google Maps is available
	 */
	isGoogleMapsAvailable(): boolean {
		if (!isBrowserEnvironment()) {
			return false;
		}

		const win = this.getWindow();
		return Boolean(win?.google?.maps);
	}

	/**
	 * Get the Google Maps API instance
	 */
	getGoogleMaps(): typeof google.maps | null {
		if (!this.isGoogleMapsAvailable()) {
			return null;
		}

		const win = this.getWindow();
		return win?.google?.maps ?? null;
	}

	/**
	 * Load Google Maps script dynamically
	 */
	private async loadScript(): Promise<void> {
		if (!isBrowserEnvironment() || !this.apiKey) {
			return;
		}

		const existingScript = this.findExistingScript();
		if (existingScript) {
			return this.handleExistingScript(existingScript);
		}

		return this.injectNewScript();
	}

	/**
	 * Find existing Google Maps script in the DOM
	 */
	private findExistingScript(): HTMLScriptElement | null {
		return document.querySelector<HTMLScriptElement>(`script[id="${GOOGLE_MAPS_SCRIPT_ID}"]`);
	}

	/**
	 * Handle existing script - either already loaded or waiting to load
	 */
	private async handleExistingScript(script: HTMLScriptElement): Promise<void> {
		if (this.isGoogleMapsAvailable()) {
			this.markScriptAsLoaded();
			return;
		}

		return this.waitForScriptLoad(script);
	}

	/**
	 * Wait for an existing script to finish loading
	 */
	private async waitForScriptLoad(script: HTMLScriptElement): Promise<void> {
		return new Promise<void>(resolve => {
			this.loadCallbacks.push(resolve);
			script.addEventListener('load', () => {
				this.markScriptAsLoaded();
				resolve();
			});
		});
	}

	/**
	 * Create and inject a new script element into the DOM
	 */
	private async injectNewScript(): Promise<void> {
		const script = this.createScriptElement();
		const headElement = document.querySelector<HTMLHeadElement>('head');

		if (!headElement) {
			this.scriptLoading = false;
			return;
		}

		return this.setupScriptLoadHandlers(script, headElement);
	}

	/**
	 * Set up load and error handlers for script injection
	 */
	private async setupScriptLoadHandlers(
		script: HTMLScriptElement,
		headElement: HTMLHeadElement
	): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			script.addEventListener('load', () => {
				this.markScriptAsLoaded();
				resolve();
			});

			script.addEventListener('error', () => {
				this.scriptLoading = false;
				reject(new Error('Failed to load Google Maps script'));
			});

			headElement.append(script);
		});
	}

	/**
	 * Mark script as loaded and notify all waiting callbacks
	 */
	private markScriptAsLoaded(): void {
		this.scriptLoaded = true;
		this.scriptLoading = false;
		this.notifyCallbacks();
	}

	/**
	 * Create script element for Google Maps
	 */
	private createScriptElement(): HTMLScriptElement {
		const script = document.createElement('script');
		script.async = true;
		script.defer = true;
		script.id = GOOGLE_MAPS_SCRIPT_ID;

		if (!this.apiKey) {
			throw new Error('API key is required to create script element');
		}

		const searchParams = new URLSearchParams({
			key: this.apiKey,
		});

		if (this.libraries.length > 0) {
			searchParams.set('libraries', this.libraries.join(','));
		}

		script.src = `${GOOGLE_MAPS_API_BASE_URL}?${searchParams.toString()}`;

		return script;
	}

	/**
	 * Notify all callbacks waiting for script load
	 */
	private notifyCallbacks(): void {
		const callbacks = [...this.loadCallbacks];
		this.loadCallbacks = [];
		for (const callback of callbacks) callback();
	}

	/**
	 * Get window object with type safety
	 */
	private getWindow(): GoogleMapsWindow | null {
		if (!isBrowserEnvironment()) {
			return null;
		}

		return globalThis.window as unknown as GoogleMapsWindow;
	}
}

export const googleMapsAdapter = new GoogleMapsAdapter();
