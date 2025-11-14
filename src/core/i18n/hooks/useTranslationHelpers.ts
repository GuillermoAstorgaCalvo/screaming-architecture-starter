import i18n from '@core/i18n/i18n';
import { isResourceCached, isResourceLoading } from '@core/i18n/resourceLoader/cache';
import { loadAndAddResource } from '@core/i18n/resourceLoader/i18n';

/**
 * Options for state update functions
 */
export interface StateUpdateFunctions {
	readonly setLoading: (loading: boolean) => void;
	readonly setIsReady: (ready: boolean) => void;
}

/**
 * Check if a resource is loaded in i18next
 * @param language - Language code
 * @param namespace - Translation namespace
 * @returns true if resource is loaded
 */
export function isResourceLoadedInI18n(language: string, namespace: string): boolean {
	return Boolean(i18n.getResourceBundle(language, namespace));
}

/**
 * Load resource for namespace and language
 * Handles caching and race conditions
 * @param namespace - Translation namespace
 * @param language - Language code
 * @returns Promise that resolves when resource is loaded
 * @throws Error if loading fails
 */
export async function ensureResourceLoaded(namespace: string, language: string): Promise<void> {
	// Check if already loaded in i18next
	if (isResourceLoadedInI18n(language, namespace)) {
		return;
	}

	// Check if cached or currently loading
	if (isResourceCached(namespace, language) || isResourceLoading(namespace, language)) {
		// Wait for existing load to complete
		await loadAndAddResource({
			i18nInstance: i18n,
			namespace,
			language,
		}).catch(error => {
			console.error(
				`Failed to load translations for namespace "${namespace}", language "${language}":`,
				error
			);
			throw error;
		});
		return;
	}

	// Load resource
	await loadAndAddResource({
		i18nInstance: i18n,
		namespace,
		language,
	}).catch(error => {
		console.error(
			`Failed to load translations for namespace "${namespace}", language "${language}":`,
			error
		);
		throw error;
	});
}

/**
 * Update loading states
 */
export function updateLoadingState(
	state: StateUpdateFunctions,
	loading: boolean,
	ready: boolean
): void {
	state.setLoading(loading);
	state.setIsReady(ready);
}

/**
 * Handle resource loading when already in progress
 */
export async function handleExistingLoad(
	namespace: string,
	language: string,
	state: StateUpdateFunctions
): Promise<void> {
	// Only set loading if not already loaded
	if (!isResourceLoadedInI18n(language, namespace)) {
		state.setLoading(true);
	}
	try {
		await ensureResourceLoaded(namespace, language);
		// Ensure namespace is loaded in i18n's namespace system
		await i18n.loadNamespaces(namespace);
		// Small delay to ensure i18n has processed the resource
		await new Promise<void>(resolve => {
			setTimeout(() => {
				resolve();
			}, 0);
		});
		state.setIsReady(isResourceLoadedInI18n(language, namespace));
	} catch {
		state.setIsReady(false);
	} finally {
		state.setLoading(false);
	}
}

/**
 * Handle initial resource loading
 */
export async function handleInitialLoad(
	namespace: string,
	language: string,
	state: StateUpdateFunctions
): Promise<void> {
	state.setLoading(true);
	state.setIsReady(false);
	try {
		await ensureResourceLoaded(namespace, language);
		// Ensure namespace is loaded in i18n's namespace system
		await i18n.loadNamespaces(namespace);
		// Small delay to ensure i18n has processed the resource
		await new Promise<void>(resolve => {
			setTimeout(() => {
				resolve();
			}, 0);
		});
		state.setIsReady(isResourceLoadedInI18n(language, namespace));
	} catch {
		state.setIsReady(false);
	} finally {
		state.setLoading(false);
	}
}
