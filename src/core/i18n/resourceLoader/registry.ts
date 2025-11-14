/**
 * Registry management for resource loaders
 * Handles registration and retrieval of resource loaders by namespace
 */

import type { ResourceLoader } from './resourceLoader.types';

/**
 * Resource loader registry
 * Maps namespace to loader function
 */
const resourceLoaders = new Map<string, ResourceLoader>();

/**
 * Register a resource loader for a namespace
 *
 * @param namespace - Translation namespace (e.g., 'landing', 'common')
 * @param loader - Function that loads translations for the namespace
 * @throws TypeError if namespace is invalid or loader is not a function
 *
 * @example
 * ```ts
 * registerResourceLoader('landing', async (namespace, language) => {
 *   return await import(`@domains/landing/i18n/${language}.json`);
 * });
 * ```
 */
export function registerResourceLoader(namespace: string, loader: ResourceLoader): void {
	if (!namespace || typeof namespace !== 'string' || namespace.trim() === '') {
		throw new TypeError('Namespace must be a non-empty string');
	}

	if (typeof loader !== 'function') {
		throw new TypeError('Loader must be a function');
	}

	const normalizedNamespace = namespace.trim();

	if (resourceLoaders.has(normalizedNamespace)) {
		console.warn(
			`Resource loader for namespace "${normalizedNamespace}" is already registered. Overwriting.`
		);
	}

	resourceLoaders.set(normalizedNamespace, loader);
}

/**
 * Get resource loader for a namespace
 * @param namespace - Translation namespace
 * @returns Resource loader or undefined
 */
export function getResourceLoader(namespace: string): ResourceLoader | undefined {
	return resourceLoaders.get(namespace);
}

/**
 * Get all registered namespaces
 * @returns Array of registered namespace strings
 */
export function getRegisteredNamespaces(): string[] {
	return Array.from(resourceLoaders.keys());
}

/**
 * Clear all resource loaders
 * Note: Core namespaces like 'common' are preserved
 */
export function clearResourceLoaders(): void {
	const commonLoader = resourceLoaders.get('common');
	resourceLoaders.clear();
	if (commonLoader) {
		resourceLoaders.set('common', commonLoader);
	}
}
