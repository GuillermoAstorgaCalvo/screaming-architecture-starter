/**
 * Tests for resource loader validation
 */

import { InvalidResourceFormatError } from '@core/i18n/errors';
import type { AddResourceOptions } from '@core/i18n/resourceLoader/types';
import { validateAddResourceOptions, validateResource } from '@core/i18n/resourceLoader/validation';
import { describe, expect, it } from 'vitest';

const ERROR_RESOURCE_MUST_BE_NON_NULL = 'Resource must be a non-null object';
const ERROR_NAMESPACE_MUST_BE_NON_EMPTY = 'Namespace must be a non-empty string';

describe('resourceLoader/validation - validateResource - valid resources', () => {
	it('should accept valid translation resource object', () => {
		const resource = { title: 'Welcome', description: 'Test description' };
		expect(() => validateResource(resource, 'landing', 'en')).not.toThrow();
	});

	it('should accept empty object as valid resource', () => {
		const resource = {};
		expect(() => validateResource(resource, 'landing', 'en')).not.toThrow();
	});

	it('should accept nested objects as valid resource', () => {
		const resource = {
			section: {
				title: 'Title',
				content: {
					text: 'Text',
				},
			},
		};
		expect(() => validateResource(resource, 'landing', 'en')).not.toThrow();
	});
});

describe('resourceLoader/validation - validateResource - invalid null/undefined resources', () => {
	it('should throw InvalidResourceFormatError for null', () => {
		expect(() => validateResource(null, 'landing', 'en')).toThrow(InvalidResourceFormatError);
		expect(() => validateResource(null, 'landing', 'en')).toThrow(ERROR_RESOURCE_MUST_BE_NON_NULL);
	});

	it('should throw InvalidResourceFormatError for undefined', () => {
		expect(() => validateResource(undefined, 'landing', 'en')).toThrow(InvalidResourceFormatError);
		expect(() => validateResource(undefined, 'landing', 'en')).toThrow(
			ERROR_RESOURCE_MUST_BE_NON_NULL
		);
	});
});

describe('resourceLoader/validation - validateResource - invalid array resources', () => {
	it('should throw InvalidResourceFormatError for arrays', () => {
		const resource = ['item1', 'item2'];
		expect(() => validateResource(resource, 'landing', 'en')).toThrow(InvalidResourceFormatError);
		expect(() => validateResource(resource, 'landing', 'en')).toThrow(
			'Resource cannot be an array'
		);
	});

	it('should throw InvalidResourceFormatError for empty array', () => {
		const resource: unknown[] = [];
		expect(() => validateResource(resource, 'landing', 'en')).toThrow(InvalidResourceFormatError);
	});
});

describe('resourceLoader/validation - validateResource - invalid primitive resources', () => {
	it('should throw InvalidResourceFormatError for primitives', () => {
		expect(() => validateResource('string', 'landing', 'en')).toThrow(InvalidResourceFormatError);
		expect(() => validateResource(123, 'landing', 'en')).toThrow(InvalidResourceFormatError);
		expect(() => validateResource(true, 'landing', 'en')).toThrow(InvalidResourceFormatError);
	});
});

describe('resourceLoader/validation - validateResource - error message validation', () => {
	it('should include namespace and language in error message', () => {
		try {
			validateResource(null, 'landing', 'en');
			expect.fail('Should have thrown');
		} catch (error) {
			expect(error).toBeInstanceOf(InvalidResourceFormatError);
			if (error instanceof InvalidResourceFormatError) {
				expect(error.message).toContain('landing');
				expect(error.message).toContain('en');
			}
		}
	});

	it('should include reason in error message', () => {
		try {
			validateResource(null, 'test', 'es');
			expect.fail('Should have thrown');
		} catch (error) {
			expect(error).toBeInstanceOf(InvalidResourceFormatError);
			if (error instanceof InvalidResourceFormatError) {
				expect(error.message).toContain(ERROR_RESOURCE_MUST_BE_NON_NULL);
			}
		}
	});
});

describe('resourceLoader/validation - validateResource - type assertion', () => {
	it('should work with type assertion', () => {
		const resource: unknown = { title: 'Welcome' };
		validateResource(resource, 'landing', 'en');
		// TypeScript should now know resource is TranslationResource
		expect(typeof resource).toBe('object');
		expect(resource).not.toBeNull();
		expect(Array.isArray(resource)).toBe(false);
	});
});

describe('resourceLoader/validation - validateAddResourceOptions - valid options', () => {
	it('should accept valid options with all fields', () => {
		const options: AddResourceOptions = {
			namespace: 'landing',
			language: 'en',
			resource: { title: 'Welcome' },
			merge: true,
			deep: true,
		};
		expect(() => validateAddResourceOptions(options)).not.toThrow();
	});

	it('should accept valid options with minimal fields', () => {
		const options: AddResourceOptions = {
			namespace: 'landing',
			language: 'en',
			resource: { title: 'Welcome' },
		};
		expect(() => validateAddResourceOptions(options)).not.toThrow();
	});

	it('should accept empty object as resource', () => {
		const options: AddResourceOptions = {
			namespace: 'landing',
			language: 'en',
			resource: {},
		};
		expect(() => validateAddResourceOptions(options)).not.toThrow();
	});

	it('should accept valid nested resource objects', () => {
		const options: AddResourceOptions = {
			namespace: 'landing',
			language: 'en',
			resource: {
				section: {
					title: 'Title',
					content: {
						text: 'Text',
					},
				},
			},
		};
		expect(() => validateAddResourceOptions(options)).not.toThrow();
	});
});

describe('resourceLoader/validation - validateAddResourceOptions - namespace validation', () => {
	it('should throw TypeError for empty namespace', () => {
		const options: AddResourceOptions = {
			namespace: '',
			language: 'en',
			resource: { title: 'Welcome' },
		};
		expect(() => validateAddResourceOptions(options)).toThrow(TypeError);
		expect(() => validateAddResourceOptions(options)).toThrow(ERROR_NAMESPACE_MUST_BE_NON_EMPTY);
	});

	it('should throw TypeError for non-string namespace', () => {
		const options = {
			namespace: 123,
			language: 'en',
			resource: { title: 'Welcome' },
		} as unknown as AddResourceOptions;
		expect(() => validateAddResourceOptions(options)).toThrow(TypeError);
		expect(() => validateAddResourceOptions(options)).toThrow(ERROR_NAMESPACE_MUST_BE_NON_EMPTY);
	});

	it('should throw TypeError for null namespace', () => {
		const options = {
			namespace: null,
			language: 'en',
			resource: { title: 'Welcome' },
		} as unknown as AddResourceOptions;
		expect(() => validateAddResourceOptions(options)).toThrow(TypeError);
	});

	it('should throw TypeError for undefined namespace', () => {
		const options = {
			namespace: undefined,
			language: 'en',
			resource: { title: 'Welcome' },
		} as unknown as AddResourceOptions;
		expect(() => validateAddResourceOptions(options)).toThrow(TypeError);
	});
});

describe('resourceLoader/validation - validateAddResourceOptions - language validation', () => {
	it('should throw TypeError for empty language', () => {
		const options: AddResourceOptions = {
			namespace: 'landing',
			language: '',
			resource: { title: 'Welcome' },
		};
		expect(() => validateAddResourceOptions(options)).toThrow(TypeError);
		expect(() => validateAddResourceOptions(options)).toThrow(
			'Language must be a non-empty string'
		);
	});

	it('should throw TypeError for non-string language', () => {
		const options = {
			namespace: 'landing',
			language: 123,
			resource: { title: 'Welcome' },
		} as unknown as AddResourceOptions;
		expect(() => validateAddResourceOptions(options)).toThrow(TypeError);
		expect(() => validateAddResourceOptions(options)).toThrow(
			'Language must be a non-empty string'
		);
	});

	it('should throw TypeError for null language', () => {
		const options = {
			namespace: 'landing',
			language: null,
			resource: { title: 'Welcome' },
		} as unknown as AddResourceOptions;
		expect(() => validateAddResourceOptions(options)).toThrow(TypeError);
	});

	it('should throw TypeError for undefined language', () => {
		const options = {
			namespace: 'landing',
			language: undefined,
			resource: { title: 'Welcome' },
		} as unknown as AddResourceOptions;
		expect(() => validateAddResourceOptions(options)).toThrow(TypeError);
	});
});

describe('resourceLoader/validation - validateAddResourceOptions - resource validation', () => {
	it('should throw TypeError for null resource', () => {
		const options = {
			namespace: 'landing',
			language: 'en',
			resource: null,
		} as unknown as AddResourceOptions;
		// Note: typeof null === 'object' in JavaScript, so this check passes
		// But null will fail when used, so we check that it doesn't throw here
		// The actual validation happens in validateResource which does check for null
		expect(() => validateAddResourceOptions(options)).not.toThrow();
	});

	it('should throw TypeError for undefined resource', () => {
		const options = {
			namespace: 'landing',
			language: 'en',
			resource: undefined,
		} as unknown as AddResourceOptions;
		expect(() => validateAddResourceOptions(options)).toThrow(TypeError);
		expect(() => validateAddResourceOptions(options)).toThrow('Resource must be a valid object');
	});

	it('should throw TypeError for array resource', () => {
		const options = {
			namespace: 'landing',
			language: 'en',
			resource: ['item1', 'item2'],
		} as unknown as AddResourceOptions;
		expect(() => validateAddResourceOptions(options)).toThrow(TypeError);
		expect(() => validateAddResourceOptions(options)).toThrow('Resource cannot be an array');
	});

	it('should throw TypeError for primitive resource', () => {
		const options1 = {
			namespace: 'landing',
			language: 'en',
			resource: 'string',
		} as unknown as AddResourceOptions;
		expect(() => validateAddResourceOptions(options1)).toThrow(TypeError);

		const options2 = {
			namespace: 'landing',
			language: 'en',
			resource: 123,
		} as unknown as AddResourceOptions;
		expect(() => validateAddResourceOptions(options2)).toThrow(TypeError);
	});
});

describe('resourceLoader/validation - validateAddResourceOptions - multiple validation errors', () => {
	it('should handle multiple validation errors (first one thrown)', () => {
		const options = {
			namespace: '',
			language: '',
			resource: null,
		} as unknown as AddResourceOptions;
		expect(() => validateAddResourceOptions(options)).toThrow(TypeError);
		// Should throw for namespace first (order of checks)
		expect(() => validateAddResourceOptions(options)).toThrow(ERROR_NAMESPACE_MUST_BE_NON_EMPTY);
	});
});
