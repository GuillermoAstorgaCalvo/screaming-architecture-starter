/**
 * HTTP Client Request Preparation
 *
 * Handles request configuration preparation, fetch config setup, and timeout management.
 */

import { prepareRequestBody } from '@core/lib/http/httpClientBody';
import { mergeConfigAndHeaders } from '@core/lib/http/httpClientConfig';
import { headersToRecord, mergeHeaders } from '@core/lib/http/httpClientHeaders';
import { executeRequestInterceptors } from '@core/lib/http/httpClientInterceptors';
import { createTimeoutController, type TimeoutController } from '@core/lib/http/httpClientTimeout';
import type { HttpClientConfig } from '@core/ports/HttpPort';

/**
 * Clear timeout controller safely
 */
export function clearTimeoutSafely(timeoutController: TimeoutController | null): void {
	if (timeoutController) {
		clearTimeout(timeoutController.timeoutId);
	}
}

/**
 * Options for preparing request configuration
 */
export interface PrepareRequestConfigOptions {
	url: string;
	config: HttpClientConfig;
	defaultConfig: HttpClientConfig;
	requestInterceptors: Parameters<typeof executeRequestInterceptors>[0];
}

/**
 * Prepare request configuration with interceptors
 */
export async function prepareRequestConfig(
	options: PrepareRequestConfigOptions
): Promise<HttpClientConfig & { url: string }> {
	const { url, config, defaultConfig, requestInterceptors } = options;
	const { mergedConfig, mergedHeaders, fullURL } = mergeConfigAndHeaders(
		url,
		config,
		defaultConfig
	);

	const requestConfig: HttpClientConfig & { url: string } = {
		...mergedConfig,
		headers: headersToRecord(mergedHeaders),
		url: fullURL,
	};

	return executeRequestInterceptors(requestInterceptors, requestConfig);
}

/**
 * Prepare final fetch configuration
 */
export function prepareFetchConfig(
	requestConfig: HttpClientConfig & { url: string },
	timeoutController: TimeoutController | null
): { finalURL: string; finalFetchConfig: RequestInit } {
	const finalURL = requestConfig.url;
	const { url: _url, baseURL: _baseURL, timeout: _timeout, body, ...fetchConfig } = requestConfig;

	if (timeoutController) {
		fetchConfig.signal = timeoutController.controller.signal;
	}

	const requestHeaders = mergeHeaders(requestConfig.headers);
	const { body: finalBody, headers: finalHeaders } = prepareRequestBody(body, requestHeaders);

	const finalFetchConfig: RequestInit = {
		...fetchConfig,
		body: finalBody ?? null,
		headers: finalHeaders,
	};

	return { finalURL, finalFetchConfig };
}

/**
 * Create timeout controller if timeout is specified
 */
export function createRequestTimeout(
	timeout: number | undefined,
	defaultTimeout: number | undefined
): TimeoutController | null {
	return createTimeoutController(timeout ?? defaultTimeout);
}
