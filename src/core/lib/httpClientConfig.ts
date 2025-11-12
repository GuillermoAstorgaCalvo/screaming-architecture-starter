/**
 * HTTP Client Configuration Management
 *
 * Handles configuration merging, default config management, and URL building
 * for the HTTP client.
 */

import type { HttpClientConfig } from '@core/ports/HttpPort';

import { mergeHeaders } from './httpClientHeaders';
import { buildURL } from './httpClientUrl';

/**
 * Set default configuration
 */
export function createDefaultConfig(): HttpClientConfig {
	return {
		headers: {
			'Content-Type': 'application/json',
		},
	};
}

/**
 * Merge configuration and headers
 */
export function mergeConfigAndHeaders(
	url: string,
	config: HttpClientConfig,
	defaultConfig: HttpClientConfig
): {
	mergedConfig: Omit<HttpClientConfig, 'headers'>;
	mergedHeaders: Headers;
	fullURL: string;
} {
	const { headers: defaultHeaders, ...restDefaultConfig } = defaultConfig;
	const { headers: configHeaders, ...restConfig } = config;
	const mergedConfig: Omit<HttpClientConfig, 'headers'> = {
		...restDefaultConfig,
		...restConfig,
	};
	const mergedHeaders = mergeHeaders(defaultHeaders, configHeaders);
	const fullURL = buildURL(url, mergedConfig.baseURL ?? defaultConfig.baseURL);
	return { mergedConfig, mergedHeaders, fullURL };
}
