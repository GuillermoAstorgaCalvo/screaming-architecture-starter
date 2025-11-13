import { env } from '@core/config/env.client';
import { getCachedRuntimeConfig } from '@core/config/runtime';
import { useMemo } from 'react';

/**
 * Hook to resolve API key from props, runtime config, or env
 */
export function useResolvedApiKey(apiKey?: string): string | null {
	return useMemo(() => {
		if (apiKey) {
			return apiKey;
		}

		const runtimeConfig = getCachedRuntimeConfig();
		if (runtimeConfig?.GOOGLE_MAPS_API_KEY) {
			return runtimeConfig.GOOGLE_MAPS_API_KEY;
		}

		return env.GOOGLE_MAPS_API_KEY ?? null;
	}, [apiKey]);
}
