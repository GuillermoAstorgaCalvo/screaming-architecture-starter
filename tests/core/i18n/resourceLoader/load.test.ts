/**
 * Tests for resource loading
 */

import { InvalidResourceFormatError, ResourceLoaderNotFoundError } from '@core/i18n/errors';
import { clearResourceCache } from '@core/i18n/resourceLoader/cache';
import { loadResource } from '@core/i18n/resourceLoader/load';
import { clearResourceLoaders, registerResourceLoader } from '@core/i18n/resourceLoader/registry';
import type { ResourceLoader, TranslationResource } from '@core/i18n/resourceLoader/types';
import { throwTestError } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const delay = (ms: number): Promise<void> =>
	new Promise(resolve => {
		setTimeout(resolve, ms);
	});

describe('resourceLoader/load - loadResource - basic loading', () => {
	beforeEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	afterEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	it('should load resource from registered loader', async () => {
		const resource: TranslationResource = { title: 'Welcome', description: 'Test' };
		const loader: ResourceLoader = async () => resource;
		registerResourceLoader('landing', loader);

		const result = await loadResource('landing', 'en');
		expect(result).toEqual(resource);
	});

	it('should handle different namespaces independently', async () => {
		const resource1: TranslationResource = { key1: 'value1' };
		const resource2: TranslationResource = { key2: 'value2' };
		const loader1: ResourceLoader = async () => resource1;
		const loader2: ResourceLoader = async () => resource2;
		registerResourceLoader('ns1', loader1);
		registerResourceLoader('ns2', loader2);

		const result1 = await loadResource('ns1', 'en');
		const result2 = await loadResource('ns2', 'en');
		expect(result1).toEqual(resource1);
		expect(result2).toEqual(resource2);
	});

	it('should handle empty resource object', async () => {
		const resource: TranslationResource = {};
		const loader: ResourceLoader = async () => resource;
		registerResourceLoader('test', loader);

		const result = await loadResource('test', 'en');
		expect(result).toEqual({});
	});

	it('should handle nested resource objects', async () => {
		const resource: TranslationResource = {
			section: {
				title: 'Title',
				content: {
					text: 'Text',
				},
			},
		};
		const loader: ResourceLoader = async () => resource;
		registerResourceLoader('test', loader);

		const result = await loadResource('test', 'en');
		expect(result).toEqual(resource);
	});
});

describe('resourceLoader/load - loadResource - caching behavior', () => {
	beforeEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	afterEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	it('should return cached resource on subsequent calls', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		let callCount = 0;
		const loader: ResourceLoader = async () => {
			callCount++;
			return resource;
		};
		registerResourceLoader('landing', loader);

		const result1 = await loadResource('landing', 'en');
		const result2 = await loadResource('landing', 'en');
		expect(result1).toEqual(resource);
		expect(result2).toEqual(resource);
		expect(callCount).toBe(1); // Loader should only be called once
	});

	it('should cache resources by namespace and language', async () => {
		const resource1: TranslationResource = { title: 'Welcome EN' };
		const resource2: TranslationResource = { title: 'Welcome ES' };
		const resource3: TranslationResource = { title: 'Welcome FR' };
		let callCount = 0;
		const loader: ResourceLoader = async (_ns, lang) => {
			callCount++;
			if (lang === 'en') return resource1;
			if (lang === 'es') return resource2;
			return resource3;
		};
		registerResourceLoader('landing', loader);

		const result1 = await loadResource('landing', 'en');
		const result2 = await loadResource('landing', 'es');
		const result3 = await loadResource('landing', 'fr');
		const result4 = await loadResource('landing', 'en'); // Should use cache

		expect(result1).toEqual(resource1);
		expect(result2).toEqual(resource2);
		expect(result3).toEqual(resource3);
		expect(result4).toEqual(resource1);
		expect(callCount).toBe(3); // One call per language
	});
});

describe('resourceLoader/load - loadResource - caching behavior - concurrent requests', () => {
	beforeEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	afterEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	it('should return same promise for concurrent requests', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		let callCount = 0;
		const loader: ResourceLoader = async () => {
			callCount++;
			// Simulate async delay
			await delay(10);
			return resource;
		};
		registerResourceLoader('landing', loader);

		// Make concurrent requests
		const promise1 = loadResource('landing', 'en');
		const promise2 = loadResource('landing', 'en');
		const promise3 = loadResource('landing', 'en');

		const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);

		expect(result1).toEqual(resource);
		expect(result2).toEqual(resource);
		expect(result3).toEqual(resource);
		expect(callCount).toBe(1); // Loader should only be called once
	});
});

describe('resourceLoader/load - loadResource - caching behavior - promise management', () => {
	beforeEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	afterEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	it('should clear loading promise after successful load', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		const loader: ResourceLoader = async () => resource;
		registerResourceLoader('landing', loader);

		await loadResource('landing', 'en');
		// Second call should use cache, not loading promise
		const result = await loadResource('landing', 'en');
		expect(result).toEqual(resource);
	});

	it('should clear loading promise after failed load', async () => {
		const loader: ResourceLoader = async () => {
			throw new Error('Load failed');
		};
		registerResourceLoader('test', loader);

		await expect(loadResource('test', 'en')).rejects.toThrow();
		// Loading promise should be cleared, so subsequent calls should retry
		await expect(loadResource('test', 'en')).rejects.toThrow();
	});
});

describe('resourceLoader/load - loadResource - error handling - ResourceLoaderNotFoundError', () => {
	beforeEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	afterEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	it('should throw ResourceLoaderNotFoundError for unregistered namespace', async () => {
		await expect(loadResource('nonexistent', 'en')).rejects.toThrow(ResourceLoaderNotFoundError);
		await expect(loadResource('nonexistent', 'en')).rejects.toThrow(
			'No resource loader registered for namespace: nonexistent'
		);
	});

	it('should throw ResourceLoaderNotFoundError with correct namespace in error', async () => {
		try {
			await loadResource('test-namespace', 'en');
			expect.fail('Should have thrown');
		} catch (error) {
			expect(error).toBeInstanceOf(ResourceLoaderNotFoundError);
			if (error instanceof ResourceLoaderNotFoundError) {
				expect(error.message).toContain('test-namespace');
			}
		}
	});
});

describe('resourceLoader/load - loadResource - error handling - InvalidResourceFormatError', () => {
	beforeEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	afterEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	it('should validate resource format and throw InvalidResourceFormatError for null', async () => {
		const loader: ResourceLoader = async () => null as unknown as TranslationResource;
		registerResourceLoader('test', loader);

		await expect(loadResource('test', 'en')).rejects.toThrow(InvalidResourceFormatError);
		await expect(loadResource('test', 'en')).rejects.toThrow('Resource must be a non-null object');
	});

	it('should validate resource format and throw InvalidResourceFormatError for array', async () => {
		const loader: ResourceLoader = async () => ['item1', 'item2'] as unknown as TranslationResource;
		registerResourceLoader('test', loader);

		await expect(loadResource('test', 'en')).rejects.toThrow(InvalidResourceFormatError);
		await expect(loadResource('test', 'en')).rejects.toThrow('Resource cannot be an array');
	});

	it('should validate resource format and throw InvalidResourceFormatError for primitive', async () => {
		const loader: ResourceLoader = async () => 'string' as unknown as TranslationResource;
		registerResourceLoader('test', loader);

		await expect(loadResource('test', 'en')).rejects.toThrow(InvalidResourceFormatError);
	});

	it('should preserve InvalidResourceFormatError from validation', async () => {
		const loader: ResourceLoader = async () => null as unknown as TranslationResource;
		registerResourceLoader('test', loader);

		try {
			await loadResource('test', 'en');
			expect.fail('Should have thrown');
		} catch (error) {
			expect(error).toBeInstanceOf(InvalidResourceFormatError);
			// InvalidResourceFormatError extends Error, so it IS an instance of Error
			expect(error).toBeInstanceOf(Error);
		}
	});
});

describe('resourceLoader/load - loadResource - error handling - loader errors', () => {
	beforeEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	afterEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	it('should wrap loader errors in generic Error', async () => {
		const errorMessage = 'Custom loader error';
		const loader: ResourceLoader = async () => {
			throw new Error(errorMessage);
		};
		registerResourceLoader('test', loader);

		await expect(loadResource('test', 'en')).rejects.toThrow(Error);
		await expect(loadResource('test', 'en')).rejects.toThrow(
			`Failed to load resource for namespace "test", language "en": ${errorMessage}`
		);
	});

	it('should handle loader throwing non-Error objects', async () => {
		const loader: ResourceLoader = async () => {
			throwTestError({ message: 'Object error' });
		};
		registerResourceLoader('test', loader);

		await expect(loadResource('test', 'en')).rejects.toThrow(Error);
		await expect(loadResource('test', 'en')).rejects.toThrow(
			'Failed to load resource for namespace "test", language "en": [object Object]'
		);
	});
});

describe('resourceLoader/load - loadResource - edge cases', () => {
	beforeEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	afterEach(() => {
		clearResourceCache();
		clearResourceLoaders();
	});

	it('should handle async loader delays', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		const loader: ResourceLoader = async () => {
			await delay(50);
			return resource;
		};
		registerResourceLoader('landing', loader);

		const start = Date.now();
		const result = await loadResource('landing', 'en');
		const duration = Date.now() - start;

		expect(result).toEqual(resource);
		expect(duration).toBeGreaterThanOrEqual(50);
	});
});
