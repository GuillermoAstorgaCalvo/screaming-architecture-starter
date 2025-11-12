/**
 * Core resource loading logic
 * Handles loading of translation resources with caching and error handling
 */

import { InvalidResourceFormatError, ResourceLoaderNotFoundError } from './errors';
import {
	deleteLoadingPromise,
	getCachedResource,
	getCacheKey,
	getLoadingPromise,
	setCachedResource,
	setLoadingPromise,
} from './resourceLoader.cache';
import { getResourceLoader } from './resourceLoader.registry';
import type { ExecuteResourceLoadOptions, TranslationResource } from './resourceLoader.types';
import { validateResource } from './resourceLoader.validation';

/**
 * Execute resource loading with error handling
 */
async function executeResourceLoad(
	options: ExecuteResourceLoadOptions
): Promise<TranslationResource> {
	const { loader, namespace, language, cacheKey } = options;
	try {
		const resource = await loader(namespace, language);
		validateResource(resource, namespace, language);
		setCachedResource(cacheKey, resource);
		return resource;
	} catch (error) {
		if (error instanceof InvalidResourceFormatError) {
			throw error;
		}

		throw new Error(
			`Failed to load resource for namespace "${namespace}", language "${language}": ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	} finally {
		deleteLoadingPromise(cacheKey);
	}
}

/**
 * Load translation resource for a namespace and language
 *
 * @param namespace - Translation namespace
 * @param language - Language code (e.g., 'en', 'es')
 * @returns Promise resolving to translation resource
 * @throws Error if loader is not registered or loading fails
 */
export async function loadResource(
	namespace: string,
	language: string
): Promise<TranslationResource> {
	const cacheKey = getCacheKey(namespace, language);

	// Check cache first
	const cached = getCachedResource(cacheKey);
	if (cached) {
		return cached;
	}

	// Check if already loading
	const existingPromise = getLoadingPromise(cacheKey);
	if (existingPromise) {
		return existingPromise;
	}

	// Get loader for namespace
	const loader = getResourceLoader(namespace);
	if (!loader) {
		throw new ResourceLoaderNotFoundError(namespace);
	}

	// Create and track loading promise
	const loadPromise = executeResourceLoad({ loader, namespace, language, cacheKey });
	setLoadingPromise(cacheKey, loadPromise);

	return loadPromise;
}
