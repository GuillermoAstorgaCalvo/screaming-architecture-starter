import { loadResource } from '@core/i18n/resourceLoader/load';
import type { TranslationResource } from '@core/i18n/resourceLoader/types';
import type { BackendModule, ReadCallback } from 'i18next';

/**
 * i18next backend adapter that loads resources using the internal resource loader registry.
 * This prevents i18next from warning about a missing backend when namespaces are loaded.
 */
class ResourceLoaderBackend implements BackendModule<TranslationResource> {
	public readonly type = 'backend';

	public init(): void {
		// No-op: all configuration lives in the resource loader registry.
	}

	public read(language: string, namespace: string, callback: ReadCallback): void {
		loadResource(namespace, language)
			.then(resource => {
				callback(null, resource);
			})
			.catch(error => {
				const normalizedError =
					error instanceof Error ? error : new Error(String(error ?? 'Unknown error'));
				callback(normalizedError, undefined as unknown as TranslationResource);
			});
	}
}

export const resourceLoaderBackend = new ResourceLoaderBackend();
