/**
 * Tests for resource loader cache management
 */

import {
	clearResourceCache,
	clearResourceCacheFor,
	getCachedResource,
	getCacheKey,
	getLoadingPromise,
	isResourceCached,
	isResourceLoading,
	setCachedResource,
	setLoadingPromise,
} from '@core/i18n/resourceLoader/cache';
import type { TranslationResource } from '@core/i18n/resourceLoader/types';
import { afterEach, describe, expect, it } from 'vitest';

const TEST_CACHE_KEY_LANDING_EN = 'landing:en';

function describeGetCacheKey() {
	describe('getCacheKey', () => {
		it('should generate cache key from namespace and language', () => {
			expect(getCacheKey('landing', 'en')).toBe(TEST_CACHE_KEY_LANDING_EN);
			expect(getCacheKey('common', 'es')).toBe('common:es');
			expect(getCacheKey('test-namespace', 'fr-CA')).toBe('test-namespace:fr-CA');
		});

		it('should handle empty strings', () => {
			expect(getCacheKey('', '')).toBe(':');
			expect(getCacheKey('namespace', '')).toBe('namespace:');
			expect(getCacheKey('', 'language')).toBe(':language');
		});

		it('should handle special characters in namespace and language', () => {
			expect(getCacheKey('test-ns_123', 'en-US')).toBe('test-ns_123:en-US');
		});
	});
}

function describeGetCachedResource() {
	describe('getCachedResource', () => {
		it('should return undefined for non-existent cache key', () => {
			expect(getCachedResource('nonexistent:en')).toBeUndefined();
		});

		it('should return cached resource when it exists', () => {
			const cacheKey = TEST_CACHE_KEY_LANDING_EN;
			const resource: TranslationResource = { title: 'Welcome', description: 'Test' };
			setCachedResource(cacheKey, resource);
			expect(getCachedResource(cacheKey)).toEqual(resource);
		});

		it('should return the exact same object reference', () => {
			const cacheKey = 'test:en';
			const resource: TranslationResource = { key: 'value' };
			setCachedResource(cacheKey, resource);
			const retrieved = getCachedResource(cacheKey);
			expect(retrieved).toBe(resource); // Same reference
		});
	});
}

function describeSetCachedResource() {
	describe('setCachedResource', () => {
		it('should cache a resource', () => {
			const cacheKey = TEST_CACHE_KEY_LANDING_EN;
			const resource: TranslationResource = { title: 'Welcome' };
			setCachedResource(cacheKey, resource);
			expect(getCachedResource(cacheKey)).toEqual(resource);
		});

		it('should overwrite existing cached resource', () => {
			const cacheKey = 'test:en';
			const resource1: TranslationResource = { key1: 'value1' };
			const resource2: TranslationResource = { key2: 'value2' };
			setCachedResource(cacheKey, resource1);
			setCachedResource(cacheKey, resource2);
			expect(getCachedResource(cacheKey)).toEqual(resource2);
		});

		it('should handle multiple namespaces and languages', () => {
			const resource1: TranslationResource = { key: 'value1' };
			const resource2: TranslationResource = { key: 'value2' };
			setCachedResource('ns1:en', resource1);
			setCachedResource('ns2:es', resource2);
			expect(getCachedResource('ns1:en')).toEqual(resource1);
			expect(getCachedResource('ns2:es')).toEqual(resource2);
		});
	});
}

function describeGetLoadingPromise() {
	describe('getLoadingPromise', () => {
		it('should return undefined for non-existent loading promise', () => {
			expect(getLoadingPromise('nonexistent:en')).toBeUndefined();
		});

		it('should return loading promise when it exists', async () => {
			const cacheKey = TEST_CACHE_KEY_LANDING_EN;
			const promise = Promise.resolve({ title: 'Welcome' } as TranslationResource);
			setLoadingPromise(cacheKey, promise);
			const retrieved = getLoadingPromise(cacheKey);
			expect(retrieved).toBe(promise);
			await promise; // Clean up
		});
	});
}

function describeSetLoadingPromise() {
	describe('setLoadingPromise', () => {
		it('should set a loading promise', async () => {
			const cacheKey = 'test:en';
			const promise = Promise.resolve({ key: 'value' } as TranslationResource);
			setLoadingPromise(cacheKey, promise);
			expect(getLoadingPromise(cacheKey)).toBe(promise);
			await promise; // Clean up
		});

		it('should overwrite existing loading promise', async () => {
			const cacheKey = 'test:en';
			const promise1 = Promise.resolve({ key1: 'value1' } as TranslationResource);
			const promise2 = Promise.resolve({ key2: 'value2' } as TranslationResource);
			setLoadingPromise(cacheKey, promise1);
			setLoadingPromise(cacheKey, promise2);
			expect(getLoadingPromise(cacheKey)).toBe(promise2);
			await Promise.all([promise1, promise2]); // Clean up
		});
	});
}

function describeClearResourceCache() {
	describe('clearResourceCache', () => {
		it('should clear all cached resources', () => {
			setCachedResource('ns1:en', { key1: 'value1' });
			setCachedResource('ns2:es', { key2: 'value2' });
			clearResourceCache();
			expect(getCachedResource('ns1:en')).toBeUndefined();
			expect(getCachedResource('ns2:es')).toBeUndefined();
		});

		it('should clear all loading promises', async () => {
			const promise1 = Promise.resolve({ key1: 'value1' } as TranslationResource);
			const promise2 = Promise.resolve({ key2: 'value2' } as TranslationResource);
			setLoadingPromise('ns1:en', promise1);
			setLoadingPromise('ns2:es', promise2);
			clearResourceCache();
			expect(getLoadingPromise('ns1:en')).toBeUndefined();
			expect(getLoadingPromise('ns2:es')).toBeUndefined();
			await Promise.all([promise1, promise2]); // Clean up
		});

		it('should clear both resources and loading promises', async () => {
			const resource: TranslationResource = { key: 'value' };
			const promise = Promise.resolve(resource);
			setCachedResource('test:en', resource);
			setLoadingPromise('test:en', promise);
			clearResourceCache();
			expect(getCachedResource('test:en')).toBeUndefined();
			expect(getLoadingPromise('test:en')).toBeUndefined();
			await promise; // Clean up
		});

		it('should handle clearing empty cache', () => {
			expect(() => clearResourceCache()).not.toThrow();
		});
	});
}

function describeClearResourceCacheFor() {
	describe('clearResourceCacheFor', () => {
		it('should clear cache for specific namespace and language', () => {
			setCachedResource('ns1:en', { key1: 'value1' });
			setCachedResource('ns1:es', { key2: 'value2' });
			setCachedResource('ns2:en', { key3: 'value3' });
			clearResourceCacheFor('ns1', 'en');
			expect(getCachedResource('ns1:en')).toBeUndefined();
			expect(getCachedResource('ns1:es')).toEqual({ key2: 'value2' });
			expect(getCachedResource('ns2:en')).toEqual({ key3: 'value3' });
		});

		it('should clear loading promise for specific namespace and language', async () => {
			const promise1 = Promise.resolve({ key1: 'value1' } as TranslationResource);
			const promise2 = Promise.resolve({ key2: 'value2' } as TranslationResource);
			setLoadingPromise('ns1:en', promise1);
			setLoadingPromise('ns1:es', promise2);
			clearResourceCacheFor('ns1', 'en');
			expect(getLoadingPromise('ns1:en')).toBeUndefined();
			expect(getLoadingPromise('ns1:es')).toBe(promise2);
			await Promise.all([promise1, promise2]); // Clean up
		});

		it('should clear both resource and loading promise for specific namespace and language', async () => {
			const resource: TranslationResource = { key: 'value' };
			const promise = Promise.resolve(resource);
			setCachedResource('test:en', resource);
			setLoadingPromise('test:en', promise);
			clearResourceCacheFor('test', 'en');
			expect(getCachedResource('test:en')).toBeUndefined();
			expect(getLoadingPromise('test:en')).toBeUndefined();
			await promise; // Clean up
		});

		it('should handle clearing non-existent cache entry', () => {
			expect(() => clearResourceCacheFor('nonexistent', 'en')).not.toThrow();
		});
	});
}

function describeIsResourceLoading() {
	describe('isResourceLoading', () => {
		it('should return false when resource is not loading', () => {
			expect(isResourceLoading('test', 'en')).toBe(false);
		});

		it('should return true when resource is loading', async () => {
			const cacheKey = 'test:en';
			const promise = Promise.resolve({ key: 'value' } as TranslationResource);
			setLoadingPromise(cacheKey, promise);
			expect(isResourceLoading('test', 'en')).toBe(true);
			await promise; // Clean up
		});

		it('should return false after loading promise is cleared', async () => {
			const cacheKey = 'test:en';
			const promise = Promise.resolve({ key: 'value' } as TranslationResource);
			setLoadingPromise(cacheKey, promise);
			clearResourceCacheFor('test', 'en');
			expect(isResourceLoading('test', 'en')).toBe(false);
			await promise; // Clean up
		});
	});
}

function describeIsResourceCached() {
	describe('isResourceCached', () => {
		it('should return false when resource is not cached', () => {
			expect(isResourceCached('test', 'en')).toBe(false);
		});

		it('should return true when resource is cached', () => {
			const resource: TranslationResource = { key: 'value' };
			setCachedResource('test:en', resource);
			expect(isResourceCached('test', 'en')).toBe(true);
		});

		it('should return false after resource is cleared', () => {
			const resource: TranslationResource = { key: 'value' };
			setCachedResource('test:en', resource);
			clearResourceCacheFor('test', 'en');
			expect(isResourceCached('test', 'en')).toBe(false);
		});

		it('should handle different namespaces and languages independently', () => {
			setCachedResource('ns1:en', { key1: 'value1' });
			setCachedResource('ns1:es', { key2: 'value2' });
			expect(isResourceCached('ns1', 'en')).toBe(true);
			expect(isResourceCached('ns1', 'es')).toBe(true);
			expect(isResourceCached('ns2', 'en')).toBe(false);
		});
	});
}

describe('resourceLoader/cache', () => {
	afterEach(() => {
		// Clear cache between tests
		clearResourceCache();
	});

	describeGetCacheKey();
	describeGetCachedResource();
	describeSetCachedResource();
	describeGetLoadingPromise();
	describeSetLoadingPromise();
	describeClearResourceCache();
	describeClearResourceCacheFor();
	describeIsResourceLoading();
	describeIsResourceCached();
});
