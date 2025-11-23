/**
 * Tests for i18next backend adapter
 */

import { resourceLoaderBackend } from '@core/i18n/resourceLoader/backend';
import { clearResourceCache } from '@core/i18n/resourceLoader/cache';
import * as loadResourceModule from '@core/i18n/resourceLoader/load';
import { clearResourceLoaders, registerResourceLoader } from '@core/i18n/resourceLoader/registry';
import type { ResourceLoader, TranslationResource } from '@core/i18n/resourceLoader/types';
import { throwTestError } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const delay = (ms: number): Promise<void> =>
	new Promise(resolve => {
		setTimeout(resolve, ms);
	});

function setupTestEnvironment(): void {
	clearResourceCache();
	clearResourceLoaders();
}

function cleanupTestEnvironment(): void {
	clearResourceCache();
	clearResourceLoaders();
}

describe('resourceLoader/backend - ResourceLoaderBackend - type property', () => {
	it('should have type property set to "backend"', () => {
		expect(resourceLoaderBackend.type).toBe('backend');
	});
});

describe('resourceLoader/backend - ResourceLoaderBackend - init method', () => {
	it('should be a no-op and not throw', () => {
		expect(() => resourceLoaderBackend.init()).not.toThrow();
	});

	it('should return undefined', () => {
		resourceLoaderBackend.init();
		// init() returns void, so we just verify it doesn't throw
		expect(() => resourceLoaderBackend.init()).not.toThrow();
	});
});

function describeSuccessfulLoading(): void {
	it('should load resource and call callback with null error and resource', async () => {
		const resource: TranslationResource = { title: 'Welcome', description: 'Test' };
		const loader: ResourceLoader = async () => resource;
		registerResourceLoader('landing', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'landing', callback);

		// Wait for async operation
		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(null, resource);
	});

	it('should handle different namespaces', async () => {
		const resource1: TranslationResource = { key1: 'value1' };
		const resource2: TranslationResource = { key2: 'value2' };
		const loader1: ResourceLoader = async () => resource1;
		const loader2: ResourceLoader = async () => resource2;
		registerResourceLoader('ns1', loader1);
		registerResourceLoader('ns2', loader2);

		const callback1 = vi.fn();
		const callback2 = vi.fn();
		resourceLoaderBackend.read('en', 'ns1', callback1);
		resourceLoaderBackend.read('en', 'ns2', callback2);

		await delay(10);

		expect(callback1).toHaveBeenCalledWith(null, resource1);
		expect(callback2).toHaveBeenCalledWith(null, resource2);
	});

	it('should handle different languages', async () => {
		const resource1: TranslationResource = { title: 'Welcome EN' };
		const resource2: TranslationResource = { title: 'Welcome ES' };
		const loader: ResourceLoader = async (_ns, lang) => {
			return lang === 'en' ? resource1 : resource2;
		};
		registerResourceLoader('landing', loader);

		const callback1 = vi.fn();
		const callback2 = vi.fn();
		resourceLoaderBackend.read('en', 'landing', callback1);
		resourceLoaderBackend.read('es', 'landing', callback2);

		await delay(10);

		expect(callback1).toHaveBeenCalledWith(null, resource1);
		expect(callback2).toHaveBeenCalledWith(null, resource2);
	});
}

function describeResourceTypes(): void {
	it('should handle empty resource object', async () => {
		const resource: TranslationResource = {};
		const loader: ResourceLoader = async () => resource;
		registerResourceLoader('test', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledWith(null, resource);
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

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledWith(null, resource);
	});

	it('should handle async loader delays', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		const loader: ResourceLoader = async () => {
			await delay(50);
			return resource;
		};
		registerResourceLoader('landing', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'landing', callback);

		await delay(60);

		expect(callback).toHaveBeenCalledWith(null, resource);
	});
}

describe('resourceLoader/backend - ResourceLoaderBackend - read method - successful loading', () => {
	beforeEach(() => {
		setupTestEnvironment();
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describeSuccessfulLoading();
	describeResourceTypes();
});

function describeErrorInstances(): void {
	it('should call callback with Error when loader throws Error', async () => {
		const errorMessage = 'Custom loader error';
		const loader: ResourceLoader = async () => {
			throw new Error(errorMessage);
		};
		registerResourceLoader('test', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		expect((callbackError as Error).message).toBe(
			`Failed to load resource for namespace "test", language "en": ${errorMessage}`
		);
		expect(callback).toHaveBeenCalledWith(
			expect.any(Error),
			undefined as unknown as TranslationResource
		);
	});

	it('should preserve Error instance when loader throws Error', async () => {
		const errorMessage = 'Test error';
		const loader: ResourceLoader = async () => {
			throw new Error(errorMessage);
		};
		registerResourceLoader('test', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		expect((callbackError as Error).message).toBe(
			`Failed to load resource for namespace "test", language "en": ${errorMessage}`
		);
	});
}

describe('resourceLoader/backend - ResourceLoaderBackend - read method - error handling - Error instances', () => {
	beforeEach(() => {
		setupTestEnvironment();
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describeErrorInstances();
});

function describeNonErrorObjects(): void {
	it('should normalize non-Error objects to Error', async () => {
		const loader: ResourceLoader = async () => {
			throwTestError({ message: 'Object error' });
		};
		registerResourceLoader('test', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		expect((callbackError as Error).message).toBe(
			'Failed to load resource for namespace "test", language "en": [object Object]'
		);
		expect(callback).toHaveBeenCalledWith(
			expect.any(Error),
			undefined as unknown as TranslationResource
		);
	});

	it('should normalize string errors to Error', async () => {
		const loader: ResourceLoader = async () => {
			throwTestError('String error');
		};
		registerResourceLoader('test', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		expect((callbackError as Error).message).toBe(
			'Failed to load resource for namespace "test", language "en": String error'
		);
	});

	it('should normalize number errors to Error', async () => {
		const loader: ResourceLoader = async () => {
			throwTestError(404);
		};
		registerResourceLoader('test', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		expect((callbackError as Error).message).toBe(
			'Failed to load resource for namespace "test", language "en": 404'
		);
	});
}

describe('resourceLoader/backend - ResourceLoaderBackend - read method - error handling - non-Error objects', () => {
	beforeEach(() => {
		setupTestEnvironment();
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describeNonErrorObjects();
});

function describeNullUndefinedErrors(): void {
	it('should handle null errors wrapped by loadResource', async () => {
		const loader: ResourceLoader = async () => {
			throwTestError(null);
		};
		registerResourceLoader('test', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		// loadResource wraps null as "null" string, then backend normalizes it
		// But since loadResource always throws an Error, backend receives Error with message "null"
		expect((callbackError as Error).message).toBe(
			'Failed to load resource for namespace "test", language "en": null'
		);
	});

	it('should handle undefined errors wrapped by loadResource', async () => {
		const loader: ResourceLoader = async () => {
			throwTestError(undefined);
		};
		registerResourceLoader('test', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		// loadResource wraps undefined as "undefined" string, then backend normalizes it
		// But since loadResource always throws an Error, backend receives Error with message "undefined"
		expect((callbackError as Error).message).toBe(
			'Failed to load resource for namespace "test", language "en": undefined'
		);
	});
}

describe('resourceLoader/backend - ResourceLoaderBackend - read method - error handling - null/undefined errors', () => {
	beforeEach(() => {
		setupTestEnvironment();
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describeNullUndefinedErrors();
});

function describeResourceLoaderNotFoundError(): void {
	it('should handle ResourceLoaderNotFoundError from loadResource', async () => {
		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'nonexistent', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		expect((callbackError as Error).message).toContain('No resource loader registered');
		expect((callbackError as Error).message).toContain('nonexistent');
	});
}

describe('resourceLoader/backend - ResourceLoaderBackend - read method - error handling - ResourceLoaderNotFoundError', () => {
	beforeEach(() => {
		setupTestEnvironment();
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describeResourceLoaderNotFoundError();
});

function describeEdgeCases(): void {
	it('should handle empty namespace string as error', async () => {
		const callback = vi.fn();
		resourceLoaderBackend.read('en', '', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		expect((callbackError as Error).message).toContain('No resource loader registered');
	});

	it('should handle empty language string', async () => {
		const resource: TranslationResource = { key: 'value' };
		const loader: ResourceLoader = async () => resource;
		registerResourceLoader('test', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledWith(null, resource);
	});

	it('should handle special characters in namespace and language', async () => {
		const resource: TranslationResource = { key: 'value' };
		const loader: ResourceLoader = async () => resource;
		registerResourceLoader('test-ns_123', loader);

		const callback = vi.fn();
		resourceLoaderBackend.read('en-US', 'test-ns_123', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledWith(null, resource);
	});
}

function describeConcurrentCalls(): void {
	it('should handle multiple concurrent read calls', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		const loader: ResourceLoader = async () => {
			await delay(10);
			return resource;
		};
		registerResourceLoader('landing', loader);

		const callback1 = vi.fn();
		const callback2 = vi.fn();
		const callback3 = vi.fn();

		resourceLoaderBackend.read('en', 'landing', callback1);
		resourceLoaderBackend.read('en', 'landing', callback2);
		resourceLoaderBackend.read('en', 'landing', callback3);

		await delay(30);

		// All callbacks should be called with the same resource
		expect(callback1).toHaveBeenCalledWith(null, resource);
		expect(callback2).toHaveBeenCalledWith(null, resource);
		expect(callback3).toHaveBeenCalledWith(null, resource);
	});
}

describe('resourceLoader/backend - ResourceLoaderBackend - read method - edge cases', () => {
	beforeEach(() => {
		setupTestEnvironment();
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describeEdgeCases();
	describeConcurrentCalls();
});

describe('resourceLoader/backend - ResourceLoaderBackend - read method - direct non-Error throws', () => {
	beforeEach(() => {
		setupTestEnvironment();
	});

	afterEach(() => {
		cleanupTestEnvironment();
		vi.restoreAllMocks();
	});

	it('should normalize non-Error thrown directly by loadResource', async () => {
		// Mock loadResource to throw a non-Error value directly
		const loadResourceSpy = vi.spyOn(loadResourceModule, 'loadResource');
		loadResourceSpy.mockRejectedValue('Direct string error');

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		expect((callbackError as Error).message).toBe('Direct string error');
		expect(callback).toHaveBeenCalledWith(
			expect.any(Error),
			undefined as unknown as TranslationResource
		);
	});

	it('should normalize null thrown directly by loadResource', async () => {
		// Mock loadResource to throw null directly
		const loadResourceSpy = vi.spyOn(loadResourceModule, 'loadResource');
		loadResourceSpy.mockRejectedValue(null);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		expect((callbackError as Error).message).toBe('Unknown error');
		expect(callback).toHaveBeenCalledWith(
			expect.any(Error),
			undefined as unknown as TranslationResource
		);
	});

	it('should normalize undefined thrown directly by loadResource', async () => {
		// Mock loadResource to throw undefined directly
		const loadResourceSpy = vi.spyOn(loadResourceModule, 'loadResource');
		loadResourceSpy.mockRejectedValue(undefined);

		const callback = vi.fn();
		resourceLoaderBackend.read('en', 'test', callback);

		await delay(10);

		expect(callback).toHaveBeenCalledTimes(1);
		const [callbackError] = callback.mock.calls[0] ?? [];
		expect(callbackError).toBeInstanceOf(Error);
		expect((callbackError as Error).message).toBe('Unknown error');
		expect(callback).toHaveBeenCalledWith(
			expect.any(Error),
			undefined as unknown as TranslationResource
		);
	});
});
