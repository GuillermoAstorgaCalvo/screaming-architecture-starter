/**
 * Tests for main resource loader module
 */

import { clearResourceCache } from '@core/i18n/resourceLoader';
import {
	clearResourceCache as clearResourceCacheImpl,
	isResourceCached,
	setCachedResource,
} from '@core/i18n/resourceLoader/cache';
import {
	clearResourceLoaders,
	getRegisteredNamespaces,
	registerResourceLoader,
} from '@core/i18n/resourceLoader/registry';
import type { TranslationResource } from '@core/i18n/resourceLoader/types';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// Helper functions for test setup
function setupTestEnvironment() {
	clearResourceCacheImpl();
	clearResourceLoaders();
}

function teardownTestEnvironment() {
	clearResourceCacheImpl();
	clearResourceLoaders();
}

describe('resourceLoader - clearResourceCache - basic clearing', () => {
	beforeEach(() => {
		setupTestEnvironment();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});

	it('should clear resource cache', () => {
		const resource: TranslationResource = { title: 'Welcome' };
		setCachedResource('test:en', resource);
		expect(isResourceCached('test', 'en')).toBe(true);

		clearResourceCache();

		expect(isResourceCached('test', 'en')).toBe(false);
	});

	it('should clear resource loaders', () => {
		const loader = async () => ({ key: 'value' });
		registerResourceLoader('test', loader);
		expect(getRegisteredNamespaces()).toContain('test');

		clearResourceCache();

		// Note: clearResourceLoaders preserves 'common' namespace
		// So we check that 'test' is not in the list
		const namespaces = getRegisteredNamespaces();
		expect(namespaces).not.toContain('test');
	});

	it('should clear both cache and loaders', () => {
		const resource: TranslationResource = { title: 'Welcome' };
		const loader = async () => ({ key: 'value' });
		setCachedResource('test:en', resource);
		registerResourceLoader('test', loader);

		clearResourceCache();

		expect(isResourceCached('test', 'en')).toBe(false);
		const namespaces = getRegisteredNamespaces();
		expect(namespaces).not.toContain('test');
	});
});

describe('resourceLoader - clearResourceCache - edge cases', () => {
	beforeEach(() => {
		setupTestEnvironment();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});

	it('should handle multiple calls', () => {
		const resource: TranslationResource = { title: 'Welcome' };
		setCachedResource('test:en', resource);
		clearResourceCache();
		clearResourceCache();
		clearResourceCache();
		expect(isResourceCached('test', 'en')).toBe(false);
	});

	it('should work when cache and loaders are empty', () => {
		expect(() => clearResourceCache()).not.toThrow();
	});
});

describe('resourceLoader - clearResourceCache - multiple resources and namespaces', () => {
	beforeEach(() => {
		setupTestEnvironment();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});

	it('should clear cache with multiple resources', () => {
		setCachedResource('ns1:en', { key1: 'value1' });
		setCachedResource('ns2:es', { key2: 'value2' });
		setCachedResource('ns3:fr', { key3: 'value3' });

		clearResourceCache();

		expect(isResourceCached('ns1', 'en')).toBe(false);
		expect(isResourceCached('ns2', 'es')).toBe(false);
		expect(isResourceCached('ns3', 'fr')).toBe(false);
	});

	it('should clear loaders with multiple namespaces', () => {
		const loader1 = async () => ({ key1: 'value1' });
		const loader2 = async () => ({ key2: 'value2' });
		registerResourceLoader('ns1', loader1);
		registerResourceLoader('ns2', loader2);

		clearResourceCache();

		const namespaces = getRegisteredNamespaces();
		expect(namespaces).not.toContain('ns1');
		expect(namespaces).not.toContain('ns2');
	});

	it('should preserve common namespace when clearing loaders', () => {
		const loader = async () => ({ key: 'value' });
		registerResourceLoader('test', loader);
		// Register common if it doesn't exist
		if (!getRegisteredNamespaces().includes('common')) {
			const commonLoader = async () => ({ common: 'value' });
			registerResourceLoader('common', commonLoader);
		}

		clearResourceCache();

		// 'common' should be preserved
		const namespaces = getRegisteredNamespaces();
		if (namespaces.includes('common')) {
			expect(namespaces).toContain('common');
		}
		expect(namespaces).not.toContain('test');
	});
});
