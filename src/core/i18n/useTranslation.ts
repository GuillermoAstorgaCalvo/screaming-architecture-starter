import { isResourceLoadedInI18n } from '@core/i18n/hooks/useTranslationHelpers';
import {
	useResourceLoader,
	useResourceLoadingEffects,
} from '@core/i18n/hooks/useTranslationLoader';
import { useResourceLoadingState } from '@core/i18n/hooks/useTranslationState';
import { isResourceLoading } from '@core/i18n/resourceLoader/cache';
import { useCallback, useEffect } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';

import i18n from './i18n';
import type { NamespaceKeys, TranslationNamespaces } from './types/types';

/**
 * Type-safe translation function
 * Provides autocomplete and type checking for translation keys
 */
export type TypedTFunction<N extends keyof TranslationNamespaces> = (
	key: NamespaceKeys<N>,
	options?: Record<string, unknown>
) => string;

/**
 * Enhanced translation hook response with loading state
 */
export interface UseTranslationReturn<N extends keyof TranslationNamespaces> {
	/**
	 * Type-safe translation function
	 */
	t: TypedTFunction<N>;
	/**
	 * i18n instance
	 */
	i18n: typeof i18n;
	/**
	 * Whether translations for the namespace are currently loading
	 */
	isLoading: boolean;
	/**
	 * Whether translations for the namespace are ready
	 */
	isReady: boolean;
	/**
	 * Ready flag from i18next
	 */
	ready: boolean;
}

/**
 * Hook for creating typed translation function
 */
function useTypedTranslation<N extends keyof TranslationNamespaces>(
	namespace: string
): TypedTFunction<N> {
	return useCallback(
		(key, options) => {
			// Always use direct i18n.t call with explicit namespace to ensure translations are found
			// This works even when resources are added dynamically
			const { language } = i18n;
			if (options) {
				return i18n.t(key, { ...options, ns: namespace, lng: language });
			}
			return i18n.t(key, { ns: namespace, lng: language });
		},
		[namespace]
	);
}

export function useTranslation<N extends keyof TranslationNamespaces = 'common'>(
	namespace: N = 'common' as N
): UseTranslationReturn<N> {
	const result = useI18nextTranslation(namespace);

	const { isLoading, isReady, setCurrentLanguage, currentLanguageRef, stateUpdaters } =
		useResourceLoadingState(namespace);

	// Set initial loading state if needed (for cases where state needs to be updated after mount)
	useEffect(() => {
		const initialLoaded = isResourceLoadedInI18n(i18n.language, namespace);
		const initialLoading = isResourceLoading(namespace, i18n.language);
		if (!initialLoaded && !initialLoading && !isLoading) {
			stateUpdaters.setLoading(true);
		}
	}, [namespace, isLoading, stateUpdaters]);

	const loadResource = useResourceLoader({
		namespace,
		stateUpdaters,
		setCurrentLanguage,
		currentLanguageRef,
	});

	useResourceLoadingEffects({ loadResource, currentLanguageRef, setCurrentLanguage });

	const typedT = useTypedTranslation<N>(namespace);

	return {
		t: typedT,
		i18n: result.i18n,
		isLoading,
		isReady,
		ready: result.ready,
	};
}
