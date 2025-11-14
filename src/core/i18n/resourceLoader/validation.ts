/**
 * Validation functions for resource loader
 */

import { InvalidResourceFormatError } from '@core/i18n/errors';
import type { AddResourceOptions, TranslationResource } from '@core/i18n/resourceLoader/types';

/**
 * Validate translation resource structure
 * @param resource - Resource to validate
 * @param namespace - Namespace for error messages
 * @param language - Language for error messages
 * @throws InvalidResourceFormatError if resource is invalid
 */
export function validateResource(
	resource: unknown,
	namespace: string,
	language: string
): asserts resource is TranslationResource {
	if (!resource || typeof resource !== 'object') {
		throw new InvalidResourceFormatError(namespace, language, 'Resource must be a non-null object');
	}

	if (Array.isArray(resource)) {
		throw new InvalidResourceFormatError(namespace, language, 'Resource cannot be an array');
	}
}

/**
 * Validate add resource options
 * @param options - Resource options to validate
 * @throws TypeError if options are invalid
 */
export function validateAddResourceOptions(options: AddResourceOptions): void {
	const { namespace, language, resource } = options;

	if (typeof namespace !== 'string' || namespace.length === 0) {
		throw new TypeError('Namespace must be a non-empty string');
	}

	if (typeof language !== 'string' || language.length === 0) {
		throw new TypeError('Language must be a non-empty string');
	}

	if (typeof resource !== 'object') {
		throw new TypeError('Resource must be a valid object');
	}

	if (Array.isArray(resource)) {
		throw new TypeError('Resource cannot be an array');
	}
}
