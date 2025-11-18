/**
 * Tests for registerResourceLoader function
 */

import {
	clearResourceLoaders,
	getResourceLoader,
	registerResourceLoader,
} from '@core/i18n/resourceLoader/registry';
import type { ResourceLoader } from '@core/i18n/resourceLoader/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createLoader } from './registry.test.helpers';

function describeValidRegistration(getWarnSpy: () => ReturnType<typeof vi.spyOn>) {
	describe('valid registration', () => {
		it('should register a resource loader', () => {
			const loader = createLoader();
			registerResourceLoader('landing', loader);
			expect(getResourceLoader('landing')).toBe(loader);
		});

		it('should register multiple loaders for different namespaces', () => {
			const loader1 = createLoader({ key1: 'value1' });
			const loader2 = createLoader({ key2: 'value2' });
			registerResourceLoader('landing', loader1);
			registerResourceLoader('common', loader2);
			expect(getResourceLoader('landing')).toBe(loader1);
			expect(getResourceLoader('common')).toBe(loader2);
		});

		it('should overwrite existing loader and warn', () => {
			const warnSpy = getWarnSpy();
			const loader1 = createLoader({ key1: 'value1' });
			const loader2 = createLoader({ key2: 'value2' });
			registerResourceLoader('test', loader1);
			registerResourceLoader('test', loader2);
			expect(getResourceLoader('test')).toBe(loader2);
			expect(warnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Resource loader for namespace "test" is already registered')
			);
		});

		it('should trim namespace whitespace', () => {
			const loader = createLoader();
			registerResourceLoader('  landing  ', loader);
			expect(getResourceLoader('landing')).toBe(loader);
			expect(getResourceLoader('  landing  ')).toBeUndefined();
		});
	});
}

function describeInvalidNamespaceValidation() {
	describe('invalid namespace validation', () => {
		it('should throw TypeError for empty string namespace', () => {
			const loader = createLoader();
			expect(() => registerResourceLoader('', loader)).toThrow(TypeError);
			expect(() => registerResourceLoader('', loader)).toThrow(
				'Namespace must be a non-empty string'
			);
		});

		it('should throw TypeError for whitespace-only namespace', () => {
			const loader = createLoader();
			expect(() => registerResourceLoader('   ', loader)).toThrow(TypeError);
			expect(() => registerResourceLoader('   ', loader)).toThrow(
				'Namespace must be a non-empty string'
			);
		});

		it('should throw TypeError for null namespace', () => {
			const loader = createLoader();
			expect(() => registerResourceLoader(null as unknown as string, loader)).toThrow(TypeError);
		});

		it('should throw TypeError for undefined namespace', () => {
			const loader = createLoader();
			expect(() => registerResourceLoader(undefined as unknown as string, loader)).toThrow(
				TypeError
			);
		});

		it('should throw TypeError for non-string namespace', () => {
			const loader = createLoader();
			expect(() => registerResourceLoader(123 as unknown as string, loader)).toThrow(TypeError);
			expect(() => registerResourceLoader({} as unknown as string, loader)).toThrow(TypeError);
		});
	});
}

function describeInvalidLoaderValidation() {
	describe('invalid loader validation', () => {
		it('should throw TypeError for non-function loader', () => {
			expect(() => registerResourceLoader('test', null as unknown as ResourceLoader)).toThrow(
				TypeError
			);
			expect(() => registerResourceLoader('test', undefined as unknown as ResourceLoader)).toThrow(
				TypeError
			);
			expect(() =>
				registerResourceLoader('test', 'not a function' as unknown as ResourceLoader)
			).toThrow(TypeError);
			expect(() => registerResourceLoader('test', {} as unknown as ResourceLoader)).toThrow(
				TypeError
			);
			expect(() => registerResourceLoader('test', 123 as unknown as ResourceLoader)).toThrow(
				TypeError
			);
		});

		it('should throw TypeError with correct message for invalid loader', () => {
			expect(() => registerResourceLoader('test', null as unknown as ResourceLoader)).toThrow(
				'Loader must be a function'
			);
		});
	});
}

describe('registerResourceLoader', () => {
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

	describeValidRegistration(() => warnSpy);
	describeInvalidNamespaceValidation();
	describeInvalidLoaderValidation();
});
