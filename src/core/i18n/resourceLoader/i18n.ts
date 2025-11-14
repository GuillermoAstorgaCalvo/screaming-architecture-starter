/**
 * i18next integration for resource loader
 * Handles adding resources to i18next instance
 */

import type { i18n as I18nInstance } from 'i18next';

import { loadResource } from './resourceLoader.load';
import type { AddResourceOptions, LoadAndAddResourceOptions } from './resourceLoader.types';
import { validateAddResourceOptions } from './resourceLoader.validation';

/**
 * Prepare resource bundle for addition (remove existing if not merging)
 * @param i18nInstance - i18next instance
 * @param params - Bundle preparation parameters
 */
function prepareResourceBundle(
	i18nInstance: I18nInstance,
	params: { language: string; namespace: string; merge: boolean }
): void {
	const { language, namespace, merge } = params;
	// i18next addResourceBundle signature: (lng, ns, resources, deep?, overwrite?)
	// When merge=false, remove existing resource bundle first to ensure complete replacement
	if (!merge && i18nInstance.hasResourceBundle(language, namespace)) {
		i18nInstance.removeResourceBundle(language, namespace);
	}
}

/**
 * Add resources to i18next instance
 *
 * @param i18nInstance - i18next instance
 * @param options - Resource options
 * @throws TypeError if options are invalid
 */
export function addResourceToI18n(i18nInstance: I18nInstance, options: AddResourceOptions): void {
	const { namespace, language, resource, merge = true, deep = true } = options;

	validateAddResourceOptions(options);
	prepareResourceBundle(i18nInstance, { language, namespace, merge });

	// When merge=false, overwrite=true; when merge=true, overwrite=false
	i18nInstance.addResourceBundle(language, namespace, resource, deep, !merge);
}

/**
 * Load and add resource to i18next
 * Convenience function that loads and adds in one call
 *
 * @param options - Loading and adding options
 * @throws ResourceLoaderNotFoundError if loader is not registered
 * @throws InvalidResourceFormatError if resource format is invalid
 */
export async function loadAndAddResource(options: LoadAndAddResourceOptions): Promise<void> {
	const { i18nInstance, namespace, language, merge, deep } = options;
	const resource = await loadResource(namespace, language);
	const addOptions: AddResourceOptions = {
		namespace,
		language,
		resource,
		...(merge !== undefined && { merge }),
		...(deep !== undefined && { deep }),
	};
	addResourceToI18n(i18nInstance, addOptions);
}
