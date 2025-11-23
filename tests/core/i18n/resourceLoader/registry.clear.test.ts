/**
 * Tests for clearResourceLoaders function
 */

import {
	clearResourceLoaders,
	getRegisteredNamespaces,
	getResourceLoader,
	registerResourceLoader,
} from '@core/i18n/resourceLoader/registry';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createLoader } from './registry.test.helpers';

function setupWarnMock() {
	const originalWarn = console.warn;
	const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
	return {
		warnSpy,
		restore: () => {
			warnSpy.mockRestore();
			console.warn = originalWarn;
		},
	};
}

describe('clearResourceLoaders', () => {
	let restoreWarn: () => void;

	beforeEach(() => {
		clearResourceLoaders();
		const mock = setupWarnMock();
		restoreWarn = mock.restore;
	});

	afterEach(() => {
		restoreWarn();
	});

	it('should clear all registered loaders', () => {
		registerResourceLoader('landing', createLoader({ key1: 'value1' }));
		registerResourceLoader('other', createLoader({ key2: 'value2' }));
		clearResourceLoaders();
		expect(getRegisteredNamespaces()).not.toContain('landing');
		expect(getResourceLoader('landing')).toBeUndefined();
		expect(getResourceLoader('other')).toBeUndefined();
	});

	it('should handle clearing empty registry', () => {
		expect(() => clearResourceLoaders()).not.toThrow();
		const namespaces = getRegisteredNamespaces();
		expect(namespaces.includes('common') ? namespaces : []).toEqual(
			namespaces.includes('common') ? ['common'] : []
		);
	});

	it('should handle clearing when common loader does not exist', () => {
		registerResourceLoader('landing', createLoader());
		clearResourceLoaders();
		expect(getRegisteredNamespaces()).not.toContain('landing');
	});

	it('should preserve common namespace loader', () => {
		const commonLoader = createLoader({ common: 'value' });
		registerResourceLoader('common', commonLoader);
		registerResourceLoader('other', createLoader({ other: 'value' }));
		clearResourceLoaders();
		expect(getResourceLoader('common')).toBe(commonLoader);
		expect(getRegisteredNamespaces()).toEqual(['common']);
	});

	it('should preserve common loader even if it was registered after other loaders', () => {
		const commonLoader = createLoader({ common: 'value' });
		registerResourceLoader('other', createLoader({ key1: 'value1' }));
		registerResourceLoader('common', commonLoader);
		clearResourceLoaders();
		expect(getResourceLoader('common')).toBe(commonLoader);
		expect(getResourceLoader('other')).toBeUndefined();
	});

	it('should preserve common loader even if it was overwritten', () => {
		const commonLoader2 = createLoader({ common2: 'value2' });
		registerResourceLoader('common', createLoader({ common1: 'value1' }));
		registerResourceLoader('common', commonLoader2);
		clearResourceLoaders();
		expect(getResourceLoader('common')).toBe(commonLoader2);
	});
});
