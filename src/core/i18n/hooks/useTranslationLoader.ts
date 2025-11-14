import {
	handleExistingLoad,
	handleInitialLoad,
	isResourceLoadedInI18n,
	type StateUpdateFunctions,
	updateLoadingState,
} from '@core/i18n/hooks/useTranslationHelpers';
import i18n from '@core/i18n/i18n';
import { isResourceCached, isResourceLoading } from '@core/i18n/resourceLoader/cache';
import { useCallback, useEffect, type useRef } from 'react';

/**
 * Options for resource loading effects
 */
interface ResourceLoadingEffectsOptions {
	readonly loadResource: () => Promise<void>;
	readonly currentLanguageRef: ReturnType<typeof useRef<string>>;
	readonly setCurrentLanguage: (lang: string) => void;
}

/**
 * Hook for managing resource loading effects
 */
export function useResourceLoadingEffects(options: ResourceLoadingEffectsOptions) {
	const { loadResource, currentLanguageRef, setCurrentLanguage } = options;

	// Load resource on mount and namespace change
	useEffect(() => {
		const load = async () => {
			await loadResource();
		};
		load().catch(() => {
			// Error already handled in loadResource
		});
	}, [loadResource]);

	// Handle language changes
	useEffect(() => {
		const handleLanguageChange = (lng: string) => {
			currentLanguageRef.current = lng;
			setCurrentLanguage(lng);
			const load = async () => {
				await loadResource();
			};
			load().catch(() => {
				// Error already handled in loadResource
			});
		};

		i18n.on('languageChanged', handleLanguageChange);

		return () => {
			i18n.off('languageChanged', handleLanguageChange);
		};
	}, [loadResource, currentLanguageRef, setCurrentLanguage]);
}

/**
 * Options for resource loader
 */
interface ResourceLoaderOptions {
	readonly namespace: string;
	readonly stateUpdaters: StateUpdateFunctions;
	readonly setCurrentLanguage: (lang: string) => void;
	readonly currentLanguageRef: ReturnType<typeof useRef<string>>;
}

/**
 * Hook for creating resource loader
 */
export function useResourceLoader(options: ResourceLoaderOptions) {
	const { namespace, stateUpdaters, setCurrentLanguage, currentLanguageRef } = options;
	return useCallback(async () => {
		const { language } = i18n;
		const previousLanguage = currentLanguageRef.current;
		const isLanguageChange = previousLanguage !== language;

		setCurrentLanguage(language);
		currentLanguageRef.current = language;

		// Already loaded
		if (isResourceLoadedInI18n(language, namespace)) {
			updateLoadingState(stateUpdaters, false, true);
			return;
		}

		// If language changed, set loading state immediately
		if (isLanguageChange) {
			stateUpdaters.setLoading(true);
			stateUpdaters.setIsReady(false);
		}

		// Already loading or cached - wait for it
		if (isResourceLoading(namespace, language) || isResourceCached(namespace, language)) {
			await handleExistingLoad(namespace, language, stateUpdaters);
			return;
		}

		// Start loading
		await handleInitialLoad(namespace, language, stateUpdaters);
	}, [namespace, stateUpdaters, setCurrentLanguage, currentLanguageRef]);
}
