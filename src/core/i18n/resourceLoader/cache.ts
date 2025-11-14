/**
 * Cache management for resource loader
 * Handles caching of loaded resources and loading state tracking
 */

import type { TranslationResource } from '@core/i18n/resourceLoader/types';

/**
 * Cache for loaded resources
 * Prevents re-loading the same resource multiple times
 */
const resourceCache = new Map<string, TranslationResource>();

/**
 * Loading state tracking
 * Tracks which resources are currently being loaded to prevent duplicate requests
 */
const loadingPromises = new Map<string, Promise<TranslationResource>>();

/**
 * Get cache key for a namespace and language
 * @param namespace - Translation namespace
 * @param language - Language code
 * @returns Cache key string
 */
export function getCacheKey(namespace: string, language: string): string {
	return `${namespace}:${language}`;
}

/**
 * Get cached resource
 * @param cacheKey - Cache key
 * @returns Cached resource or undefined
 */
export function getCachedResource(cacheKey: string): TranslationResource | undefined {
	return resourceCache.get(cacheKey);
}

/**
 * Set cached resource
 * @param cacheKey - Cache key
 * @param resource - Resource to cache
 */
export function setCachedResource(cacheKey: string, resource: TranslationResource): void {
	resourceCache.set(cacheKey, resource);
}

/**
 * Get loading promise for a cache key
 * @param cacheKey - Cache key
 * @returns Loading promise or undefined
 */
export function getLoadingPromise(cacheKey: string): Promise<TranslationResource> | undefined {
	return loadingPromises.get(cacheKey);
}

/**
 * Set loading promise for a cache key
 * @param cacheKey - Cache key
 * @param promise - Loading promise
 */
export function setLoadingPromise(cacheKey: string, promise: Promise<TranslationResource>): void {
	loadingPromises.set(cacheKey, promise);
}

/**
 * Delete loading promise for a cache key
 * @param cacheKey - Cache key
 */
export function deleteLoadingPromise(cacheKey: string): void {
	loadingPromises.delete(cacheKey);
}

/**
 * Clear resource cache
 * Useful for development hot-reloading or testing
 * Note: This does not clear resources from i18next instance
 */
export function clearResourceCache(): void {
	resourceCache.clear();
	loadingPromises.clear();
}

/**
 * Clear cache for a specific namespace and language
 * @param namespace - Translation namespace
 * @param language - Language code
 */
export function clearResourceCacheFor(namespace: string, language: string): void {
	const cacheKey = getCacheKey(namespace, language);
	resourceCache.delete(cacheKey);
	loadingPromises.delete(cacheKey);
}

/**
 * Check if a resource is currently loading
 * @param namespace - Translation namespace
 * @param language - Language code
 * @returns true if resource is currently loading
 */
export function isResourceLoading(namespace: string, language: string): boolean {
	const cacheKey = getCacheKey(namespace, language);
	return loadingPromises.has(cacheKey);
}

/**
 * Check if a resource is cached
 * @param namespace - Translation namespace
 * @param language - Language code
 * @returns true if resource is cached
 */
export function isResourceCached(namespace: string, language: string): boolean {
	const cacheKey = getCacheKey(namespace, language);
	return resourceCache.has(cacheKey);
}
