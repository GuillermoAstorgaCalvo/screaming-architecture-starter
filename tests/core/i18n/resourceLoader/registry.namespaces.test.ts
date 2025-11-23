/**
 * Tests for getRegisteredNamespaces function
 */

import {
	clearResourceLoaders,
	getRegisteredNamespaces,
	registerResourceLoader,
} from '@core/i18n/resourceLoader/registry';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createLoader, filterCommonNamespace } from './registry.test.helpers';

describe('getRegisteredNamespaces', () => {
	const originalWarn = console.warn;
	let warnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		clearResourceLoaders();
		warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		warnSpy.mockRestore();
		console.warn = originalWarn;
	});

	it('should return empty array when no loaders are registered', () => {
		// Note: 'common' namespace may be registered during i18n initialization
		const namespaces = getRegisteredNamespaces();
		const filtered = filterCommonNamespace(namespaces);
		expect(filtered).toEqual([]);
	});

	it('should return array of registered namespaces', () => {
		const loader1 = createLoader({ key1: 'value1' });
		const loader2 = createLoader({ key2: 'value2' });
		registerResourceLoader('landing', loader1);
		registerResourceLoader('common', loader2);
		const namespaces = getRegisteredNamespaces();
		expect(namespaces).toHaveLength(2);
		expect(namespaces).toContain('landing');
		expect(namespaces).toContain('common');
	});

	it('should return namespaces in registration order', () => {
		const loader1 = createLoader({ key1: 'value1' });
		const loader2 = createLoader({ key2: 'value2' });
		const loader3 = createLoader({ key3: 'value3' });
		registerResourceLoader('first', loader1);
		registerResourceLoader('second', loader2);
		registerResourceLoader('third', loader3);
		const namespaces = getRegisteredNamespaces();
		const filtered = filterCommonNamespace(namespaces);
		expect(filtered).toEqual(['first', 'second', 'third']);
	});

	it('should update when loaders are overwritten', () => {
		const loader1 = createLoader({ key1: 'value1' });
		const loader2 = createLoader({ key2: 'value2' });
		registerResourceLoader('test', loader1);
		registerResourceLoader('test', loader2);
		const namespaces = getRegisteredNamespaces();
		const filtered = filterCommonNamespace(namespaces);
		expect(filtered).toEqual(['test']);
		expect(filtered).toHaveLength(1);
	});
});
