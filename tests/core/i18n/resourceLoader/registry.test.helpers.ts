/**
 * Helper functions for registry tests
 */

import type { ResourceLoader } from '@core/i18n/resourceLoader/types';

const DEFAULT_LOADER_DATA = { key: 'value' };

export function createLoader(data?: Record<string, string>): ResourceLoader {
	return async () => data ?? DEFAULT_LOADER_DATA;
}

export function filterCommonNamespace(namespaces: string[]): string[] {
	return namespaces.filter(ns => ns !== 'common');
}
