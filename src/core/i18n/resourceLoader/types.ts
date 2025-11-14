/**
 * Type definitions for resource loader
 */

import type { i18n as I18nInstance } from 'i18next';

/**
 * Translation resource type
 * Represents translations for a namespace in a specific language
 * Must be a plain object (not arrays, primitives, etc.)
 */
export type TranslationResource = Record<string, unknown>;

/**
 * Resource loader function
 * Dynamically loads translation resources for a namespace and language
 */
export type ResourceLoader = (namespace: string, language: string) => Promise<TranslationResource>;

/**
 * Options for resource loading execution
 */
export interface ExecuteResourceLoadOptions {
	readonly loader: ResourceLoader;
	readonly namespace: string;
	readonly language: string;
	readonly cacheKey: string;
}

/**
 * Options for adding resources to i18next
 */
export interface AddResourceOptions {
	readonly namespace: string;
	readonly language: string;
	readonly resource: TranslationResource;
	readonly merge?: boolean;
	readonly deep?: boolean;
}

/**
 * Options for loading and adding resources
 */
export interface LoadAndAddResourceOptions {
	readonly i18nInstance: I18nInstance;
	readonly namespace: string;
	readonly language: string;
	readonly merge?: boolean;
	readonly deep?: boolean;
}
