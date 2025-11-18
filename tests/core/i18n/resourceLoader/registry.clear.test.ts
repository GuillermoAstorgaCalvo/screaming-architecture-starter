/**
 * Tests for clearResourceLoaders function
 */

import {
	clearResourceLoaders,
	getRegisteredNamespaces,
	getResourceLoader,
	registerResourceLoader,
} from '@core/i18n/resourceLoader/registry';
import { beforeEach, describe, expect, it } from 'vitest';

import { createLoader } from './registry.test.helpers';

describe('clearResourceLoaders', () => {
	beforeEach(() => {
		clearResourceLoaders();
	});

	it('should clear all registered loaders', () => {
		const loader1 = createLoader({ key1: 'value1' });
		const loader2 = createLoader({ key2: 'value2' });
		registerResourceLoader('landing', loader1);
		// Note: 'common' is preserved by clearResourceLoaders, so we register a different one
		registerResourceLoader('other', loader2);
		clearResourceLoaders();
		// 'common' is preserved, but 'landing' and 'other' should be cleared
		const namespaces = getRegisteredNamespaces();
		expect(namespaces).not.toContain('landing');
		expect(namespaces).not.toContain('other');
		expect(getResourceLoader('landing')).toBeUndefined();
		expect(getResourceLoader('other')).toBeUndefined();
	});

	it('should preserve common namespace loader', () => {
		const commonLoader = createLoader({ common: 'value' });
		const otherLoader = createLoader({ other: 'value' });
		registerResourceLoader('common', commonLoader);
		registerResourceLoader('other', otherLoader);
		clearResourceLoaders();
		expect(getResourceLoader('common')).toBe(commonLoader);
		expect(getResourceLoader('other')).toBeUndefined();
		expect(getRegisteredNamespaces()).toEqual(['common']);
	});

	it('should handle clearing when common loader does not exist', () => {
		const loader = createLoader();
		registerResourceLoader('landing', loader);
		clearResourceLoaders();
		// 'common' may exist from i18n initialization, but 'landing' should be cleared
		const namespaces = getRegisteredNamespaces();
		expect(namespaces).not.toContain('landing');
	});

	it('should handle clearing empty registry', () => {
		expect(() => clearResourceLoaders()).not.toThrow();
		// 'common' may exist from i18n initialization
		const namespaces = getRegisteredNamespaces();
		// If 'common' exists, it should be preserved
		if (namespaces.includes('common')) {
			expect(namespaces).toEqual(['common']);
		} else {
			expect(namespaces).toEqual([]);
		}
	});

	it('should preserve common loader even if it was registered after other loaders', () => {
		const loader1 = createLoader({ key1: 'value1' });
		const commonLoader = createLoader({ common: 'value' });
		registerResourceLoader('other', loader1);
		registerResourceLoader('common', commonLoader);
		clearResourceLoaders();
		expect(getResourceLoader('common')).toBe(commonLoader);
		expect(getResourceLoader('other')).toBeUndefined();
	});

	it('should preserve common loader even if it was overwritten', () => {
		const commonLoader1 = createLoader({ common1: 'value1' });
		const commonLoader2 = createLoader({ common2: 'value2' });
		registerResourceLoader('common', commonLoader1);
		registerResourceLoader('common', commonLoader2);
		clearResourceLoaders();
		expect(getResourceLoader('common')).toBe(commonLoader2);
	});
});
