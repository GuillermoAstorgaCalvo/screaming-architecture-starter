import { useCallback, useMemo, useRef, useState } from 'react';

import i18n from './i18n';
import { isResourceLoading } from './resourceLoader.cache';
import { isResourceLoadedInI18n, type StateUpdateFunctions } from './useTranslationHelpers';

/**
 * Create loading state key
 */
function getLoadingStateKey(namespace: string, language: string): string {
	return `${namespace}:${language}`;
}

/**
 * Initialize loading states map
 */
function initializeLoadingStates(
	namespace: string,
	currentLanguage: string,
	initialLoading: boolean
): Map<string, boolean> {
	const map = new Map<string, boolean>();
	if (initialLoading) {
		const key = getLoadingStateKey(namespace, currentLanguage);
		map.set(key, true);
	}
	return map;
}

/**
 * Hook for managing loading state updates
 */
export function useLoadingStateUpdater(
	namespace: string,
	currentLanguage: string,
	initialLoading: boolean = false
) {
	const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(() =>
		initializeLoadingStates(namespace, currentLanguage, initialLoading)
	);

	const isLoading = useMemo(() => {
		const key = getLoadingStateKey(namespace, currentLanguage);
		return loadingStates.get(key) ?? false;
	}, [namespace, loadingStates, currentLanguage]);

	const setLoading = useCallback(
		(loading: boolean) => {
			const key = getLoadingStateKey(namespace, currentLanguage);
			setLoadingStates(prev => {
				const next = new Map(prev);
				if (loading) {
					next.set(key, true);
				} else {
					next.delete(key);
				}
				return next;
			});
		},
		[namespace, currentLanguage]
	);

	return { isLoading, setLoading };
}

/**
 * Hook for managing resource loading state
 */
export function useResourceLoadingState(namespace: string) {
	const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
	const initialLoaded = isResourceLoadedInI18n(i18n.language, namespace);
	const initialLoading = isResourceLoading(namespace, i18n.language);
	const [isReady, setIsReady] = useState(initialLoaded);
	const currentLanguageRef = useRef(i18n.language);

	// Initialize loading state synchronously
	const initialLoadingState = !initialLoaded && !initialLoading;
	const { isLoading, setLoading } = useLoadingStateUpdater(
		namespace,
		currentLanguage,
		initialLoadingState
	);

	const stateUpdaters = useMemo<StateUpdateFunctions>(
		() => ({ setLoading, setIsReady }),
		[setLoading, setIsReady]
	);

	return {
		isLoading,
		isReady,
		setCurrentLanguage,
		currentLanguageRef,
		stateUpdaters,
	};
}
