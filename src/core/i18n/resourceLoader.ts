/**
 * Resource loader for i18n translations
 *
 * This module provides a flexible system for loading translation resources
 * dynamically with caching, validation, and i18next integration.
 *
 * @module core/i18n/resourceLoader
 */

import { clearResourceCache as clearResourceCacheImpl } from './resourceLoader.cache';
import { clearResourceLoaders } from './resourceLoader.registry';

/**
 * Clear resource cache
 * Useful for development hot-reloading or testing
 * Note: This does not clear resources from i18next instance
 * Also clears registered resource loaders (namespaces)
 * Note: Core namespaces like 'common' are preserved
 */
export function clearResourceCache(): void {
	clearResourceCacheImpl();
	clearResourceLoaders();
}
