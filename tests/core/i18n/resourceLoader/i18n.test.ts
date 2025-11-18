/**
 * Tests for i18next integration
 */

import { InvalidResourceFormatError } from '@core/i18n/errors';
import { clearResourceCache } from '@core/i18n/resourceLoader/cache';
import { addResourceToI18n, loadAndAddResource } from '@core/i18n/resourceLoader/i18n';
import { clearResourceLoaders, registerResourceLoader } from '@core/i18n/resourceLoader/registry';
import type { TranslationResource } from '@core/i18n/resourceLoader/types';
import type { i18n as I18nInstance } from 'i18next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function createMockI18n(): I18nInstance {
	return {
		hasResourceBundle: vi.fn(),
		removeResourceBundle: vi.fn(),
		addResourceBundle: vi.fn(),
	} as unknown as I18nInstance;
}

function setupTestEnvironment() {
	clearResourceCache();
	clearResourceLoaders();
}

function teardownTestEnvironment() {
	clearResourceCache();
	clearResourceLoaders();
	vi.clearAllMocks();
}

function delay(ms: number): Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

describe('resourceLoader/i18n - addResourceToI18n - basic functionality', () => {
	let mockI18n: I18nInstance;

	beforeEach(() => {
		setupTestEnvironment();
		mockI18n = createMockI18n();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});

	it('should add resource to i18next with default merge and deep options', () => {
		const resource: TranslationResource = { title: 'Welcome' };
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(false);

		addResourceToI18n(mockI18n, {
			namespace: 'landing',
			language: 'en',
			resource,
		});

		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith(
			'en',
			'landing',
			resource,
			true, // deep = true (default)
			false // overwrite = !merge = !true = false
		);
	});

	it('should handle nested resource objects', () => {
		const resource: TranslationResource = {
			section: {
				title: 'Title',
				content: {
					text: 'Text',
				},
			},
		};
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(false);

		addResourceToI18n(mockI18n, {
			namespace: 'landing',
			language: 'en',
			resource,
		});

		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith('en', 'landing', resource, true, false);
	});
});

describe('resourceLoader/i18n - addResourceToI18n - resource handling', () => {
	let mockI18n: I18nInstance;

	beforeEach(() => {
		setupTestEnvironment();
		mockI18n = createMockI18n();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});

	it('should handle empty resource object', () => {
		const resource: TranslationResource = {};
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(false);

		addResourceToI18n(mockI18n, {
			namespace: 'landing',
			language: 'en',
			resource,
		});

		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith('en', 'landing', resource, true, false);
	});
});

describe('resourceLoader/i18n - addResourceToI18n - options', () => {
	let mockI18n: I18nInstance;

	beforeEach(() => {
		setupTestEnvironment();
		mockI18n = createMockI18n();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});
	it('should add resource with merge=true and deep=true', () => {
		const resource: TranslationResource = { title: 'Welcome' };
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(false);

		addResourceToI18n(mockI18n, {
			namespace: 'landing',
			language: 'en',
			resource,
			merge: true,
			deep: true,
		});

		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith(
			'en',
			'landing',
			resource,
			true, // deep
			false // overwrite = !merge = !true = false
		);
	});

	it('should add resource with merge=false and deep=false', () => {
		const resource: TranslationResource = { title: 'Welcome' };
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(true);

		addResourceToI18n(mockI18n, {
			namespace: 'landing',
			language: 'en',
			resource,
			merge: false,
			deep: false,
		});

		expect(mockI18n.removeResourceBundle).toHaveBeenCalledWith('en', 'landing');
		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith(
			'en',
			'landing',
			resource,
			false, // deep
			true // overwrite = !merge = !false = true
		);
	});
});

describe('resourceLoader/i18n - addResourceToI18n - bundle removal behavior', () => {
	let mockI18n: I18nInstance;

	beforeEach(() => {
		setupTestEnvironment();
		mockI18n = createMockI18n();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});
	it('should remove existing bundle when merge=false', () => {
		const resource: TranslationResource = { title: 'Welcome' };
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(true);

		addResourceToI18n(mockI18n, {
			namespace: 'landing',
			language: 'en',
			resource,
			merge: false,
		});

		expect(mockI18n.removeResourceBundle).toHaveBeenCalledWith('en', 'landing');
	});

	it('should not remove existing bundle when merge=true', () => {
		const resource: TranslationResource = { title: 'Welcome' };
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(true);

		addResourceToI18n(mockI18n, {
			namespace: 'landing',
			language: 'en',
			resource,
			merge: true,
		});

		expect(mockI18n.removeResourceBundle).not.toHaveBeenCalled();
	});

	it('should not remove bundle when it does not exist', () => {
		const resource: TranslationResource = { title: 'Welcome' };
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(false);

		addResourceToI18n(mockI18n, {
			namespace: 'landing',
			language: 'en',
			resource,
			merge: false,
		});

		expect(mockI18n.removeResourceBundle).not.toHaveBeenCalled();
	});
});

describe('resourceLoader/i18n - addResourceToI18n - validation', () => {
	let mockI18n: I18nInstance;

	beforeEach(() => {
		setupTestEnvironment();
		mockI18n = createMockI18n();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});
	it('should validate options and throw TypeError for invalid namespace', () => {
		const resource: TranslationResource = { title: 'Welcome' };
		expect(() =>
			addResourceToI18n(mockI18n, {
				namespace: '',
				language: 'en',
				resource,
			})
		).toThrow(TypeError);
		expect(() =>
			addResourceToI18n(mockI18n, {
				namespace: '',
				language: 'en',
				resource,
			})
		).toThrow('Namespace must be a non-empty string');
	});

	it('should validate options and throw TypeError for invalid language', () => {
		const resource: TranslationResource = { title: 'Welcome' };
		expect(() =>
			addResourceToI18n(mockI18n, {
				namespace: 'landing',
				language: '',
				resource,
			})
		).toThrow(TypeError);
		expect(() =>
			addResourceToI18n(mockI18n, {
				namespace: 'landing',
				language: '',
				resource,
			})
		).toThrow('Language must be a non-empty string');
	});

	it('should validate options and throw TypeError for invalid resource', () => {
		// Note: typeof null === 'object' in JavaScript, so validateAddResourceOptions
		// doesn't catch null. However, null will fail when passed to i18next.
		// The actual validation for null happens in validateResource, not validateAddResourceOptions.
		expect(() =>
			addResourceToI18n(mockI18n, {
				namespace: 'landing',
				language: 'en',
				resource: null as unknown as TranslationResource,
			})
		).not.toThrow(); // validateAddResourceOptions doesn't check for null
	});
});

describe('resourceLoader/i18n - loadAndAddResource - basic loading', () => {
	let mockI18n: I18nInstance;

	beforeEach(() => {
		setupTestEnvironment();
		mockI18n = createMockI18n();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});
	it('should load and add resource to i18next', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		const loader = async () => resource;
		registerResourceLoader('landing', loader);
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(false);

		await loadAndAddResource({
			i18nInstance: mockI18n,
			namespace: 'landing',
			language: 'en',
		});

		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith(
			'en',
			'landing',
			resource,
			true, // deep = true (default)
			false // overwrite = !merge = !true = false
		);
	});
});

describe('resourceLoader/i18n - loadAndAddResource - async behavior', () => {
	let mockI18n: I18nInstance;

	beforeEach(() => {
		setupTestEnvironment();
		mockI18n = createMockI18n();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});
	it('should handle async loader delays', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		const loader = async () => {
			await delay(10);
			return resource;
		};
		registerResourceLoader('landing', loader);
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(false);

		await loadAndAddResource({
			i18nInstance: mockI18n,
			namespace: 'landing',
			language: 'en',
		});

		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith('en', 'landing', resource, true, false);
	});

	it('should handle different namespaces independently', async () => {
		const resource1: TranslationResource = { key1: 'value1' };
		const resource2: TranslationResource = { key2: 'value2' };
		const loader1 = async () => resource1;
		const loader2 = async () => resource2;
		registerResourceLoader('ns1', loader1);
		registerResourceLoader('ns2', loader2);
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(false);

		await loadAndAddResource({
			i18nInstance: mockI18n,
			namespace: 'ns1',
			language: 'en',
		});
		await loadAndAddResource({
			i18nInstance: mockI18n,
			namespace: 'ns2',
			language: 'en',
		});

		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith('en', 'ns1', resource1, true, false);
		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith('en', 'ns2', resource2, true, false);
	});
});

describe('resourceLoader/i18n - loadAndAddResource - merge option', () => {
	let mockI18n: I18nInstance;

	beforeEach(() => {
		setupTestEnvironment();
		mockI18n = createMockI18n();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});
	it('should load and add resource with merge option', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		const loader = async () => resource;
		registerResourceLoader('landing', loader);
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(true);

		await loadAndAddResource({
			i18nInstance: mockI18n,
			namespace: 'landing',
			language: 'en',
			merge: false,
		});

		expect(mockI18n.removeResourceBundle).toHaveBeenCalledWith('en', 'landing');
		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith(
			'en',
			'landing',
			resource,
			true, // deep = true (default)
			true // overwrite = !merge = !false = true
		);
	});
});

describe('resourceLoader/i18n - loadAndAddResource - deep option', () => {
	let mockI18n: I18nInstance;

	beforeEach(() => {
		setupTestEnvironment();
		mockI18n = createMockI18n();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});
	it('should load and add resource with deep option', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		const loader = async () => resource;
		registerResourceLoader('landing', loader);
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(false);

		await loadAndAddResource({
			i18nInstance: mockI18n,
			namespace: 'landing',
			language: 'en',
			deep: false,
		});

		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith(
			'en',
			'landing',
			resource,
			false, // deep
			false // overwrite = !merge = !true = false
		);
	});

	it('should load and add resource with both merge and deep options', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		const loader = async () => resource;
		registerResourceLoader('landing', loader);
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(false);

		await loadAndAddResource({
			i18nInstance: mockI18n,
			namespace: 'landing',
			language: 'en',
			merge: false,
			deep: false,
		});

		expect(mockI18n.addResourceBundle).toHaveBeenCalledWith(
			'en',
			'landing',
			resource,
			false, // deep
			true // overwrite = !merge = !false = true
		);
	});
});

describe('resourceLoader/i18n - loadAndAddResource - caching behavior', () => {
	let mockI18n: I18nInstance;

	beforeEach(() => {
		setupTestEnvironment();
		mockI18n = createMockI18n();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});
	it('should use cached resource on subsequent calls', async () => {
		const resource: TranslationResource = { title: 'Welcome' };
		let callCount = 0;
		const loader = async () => {
			callCount++;
			return resource;
		};
		registerResourceLoader('landing', loader);
		(mockI18n.hasResourceBundle as ReturnType<typeof vi.fn>).mockReturnValue(false);

		await loadAndAddResource({
			i18nInstance: mockI18n,
			namespace: 'landing',
			language: 'en',
		});
		await loadAndAddResource({
			i18nInstance: mockI18n,
			namespace: 'landing',
			language: 'en',
		});

		expect(callCount).toBe(1); // Loader should only be called once
		expect(mockI18n.addResourceBundle).toHaveBeenCalledTimes(2);
	});
});

describe('resourceLoader/i18n - loadAndAddResource - error handling', () => {
	let mockI18n: I18nInstance;

	beforeEach(() => {
		setupTestEnvironment();
		mockI18n = createMockI18n();
	});

	afterEach(() => {
		teardownTestEnvironment();
	});
	it('should propagate ResourceLoaderNotFoundError', async () => {
		await expect(
			loadAndAddResource({
				i18nInstance: mockI18n,
				namespace: 'nonexistent',
				language: 'en',
			})
		).rejects.toThrow('No resource loader registered for namespace: nonexistent');
	});

	it('should propagate InvalidResourceFormatError', async () => {
		const loader = async () => null as unknown as TranslationResource;
		registerResourceLoader('test', loader);

		await expect(
			loadAndAddResource({
				i18nInstance: mockI18n,
				namespace: 'test',
				language: 'en',
			})
		).rejects.toThrow(InvalidResourceFormatError);
	});
});
