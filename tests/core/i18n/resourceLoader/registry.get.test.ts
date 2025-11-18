/**
 * Tests for getResourceLoader function
 */

import {
	clearResourceLoaders,
	getResourceLoader,
	registerResourceLoader,
} from '@core/i18n/resourceLoader/registry';
import { beforeEach, describe, expect, it } from 'vitest';

import { createLoader } from './registry.test.helpers';

describe('getResourceLoader', () => {
	beforeEach(() => {
		clearResourceLoaders();
	});

	it('should return undefined for non-existent namespace', () => {
		expect(getResourceLoader('nonexistent')).toBeUndefined();
	});

	it('should return registered loader', () => {
		const loader = createLoader();
		registerResourceLoader('landing', loader);
		expect(getResourceLoader('landing')).toBe(loader);
	});

	it('should return exact same function reference', () => {
		const loader = createLoader();
		registerResourceLoader('test', loader);
		const retrieved = getResourceLoader('test');
		expect(retrieved).toBe(loader); // Same reference
	});

	it('should handle case-sensitive namespace lookup', () => {
		const loader = createLoader();
		registerResourceLoader('Landing', loader);
		expect(getResourceLoader('Landing')).toBe(loader);
		expect(getResourceLoader('landing')).toBeUndefined();
	});
});
