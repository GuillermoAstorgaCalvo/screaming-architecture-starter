import { buildApiUrl } from '@core/constants/endpoints';
import type { HttpClientConfig } from '@core/ports/HttpPort';

import type {
	ApiHttpMethod,
	ApiServiceConfig,
	ApiServiceExecuteOptions,
	ApiServiceRequestConfig,
} from './createApiService.types';

const UNSERIALIZABLE_PLACEHOLDER = '[Unserializable]';

export interface PrepareRequestParams<TRequest, TRawResponse, TResponse> {
	readonly endpoint: ApiServiceConfig<TRequest, TRawResponse, TResponse>['endpoint'];
	readonly request: TRequest;
	readonly requestConfig: ApiServiceRequestConfig;
	readonly method: ApiHttpMethod;
	readonly defaultConfig?: HttpClientConfig;
	readonly options?: ApiServiceExecuteOptions;
}

export interface PreparedRequest {
	readonly url: string;
	readonly config: HttpClientConfig;
}

export function prepareRequest<TRequest, TRawResponse, TResponse>(
	params: PrepareRequestParams<TRequest, TRawResponse, TResponse>
): PreparedRequest {
	const endpoint = resolveEndpoint(params.endpoint, params.request, params.requestConfig.path);
	const url = buildUrlWithQuery(endpoint, params.requestConfig.query);
	const mergedConfig = mergeHttpConfigs([
		params.defaultConfig,
		params.requestConfig.config,
		params.options?.httpConfig,
		buildHttpConfigFromOptions(params.options),
	]);

	const config: HttpClientConfig = {
		...mergedConfig,
		method: params.method,
	};

	if (params.requestConfig.body !== undefined) {
		config.body = params.requestConfig.body;
	}

	return { url, config };
}

export function mergeHttpConfigs(configs: Array<HttpClientConfig | undefined>): HttpClientConfig {
	const result: HttpClientConfig = {};

	for (const config of configs) {
		if (!config) {
			continue;
		}

		const { headers, body: _body, method: _method, ...rest } = config;
		Object.assign(result, rest);

		if (headers) {
			result.headers = {
				...result.headers,
				...headers,
			};
		}
	}

	if (result.headers && Object.keys(result.headers).length === 0) {
		delete result.headers;
	}

	return result;
}

export function buildHttpConfigFromOptions(
	options?: ApiServiceExecuteOptions
): HttpClientConfig | undefined {
	if (!options) {
		return undefined;
	}

	const result: HttpClientConfig = {};

	if (options.headers) {
		result.headers = { ...options.headers };
	}
	if (options.timeout !== undefined) {
		result.timeout = options.timeout;
	}
	if (options.signal) {
		result.signal = options.signal;
	}

	return Object.keys(result).length > 0 ? result : undefined;
}

function resolveEndpoint<TRequest>(
	endpoint: ApiServiceConfig<TRequest>['endpoint'],
	request: TRequest,
	overridePath?: string
): string {
	if (overridePath) {
		return overridePath;
	}
	return typeof endpoint === 'function' ? endpoint(request) : endpoint;
}

function buildUrlWithQuery(endpoint: string, query?: Record<string, unknown>): string {
	const baseUrl = buildApiUrl(endpoint);
	return applyQueryParams(baseUrl, query);
}

function applyQueryParams(url: string, query?: Record<string, unknown>): string {
	if (!query) {
		return url;
	}

	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		appendQueryValue(params, key, value);
	}

	const queryString = params.toString();
	if (!queryString) {
		return url;
	}

	const separator = url.includes('?') ? '&' : '?';
	return `${url}${separator}${queryString}`;
}

function appendQueryValue(target: URLSearchParams, key: string, value: unknown): void {
	if (value === undefined || value === null) {
		return;
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			appendQueryValue(target, key, item);
		}
		return;
	}

	target.append(key, serializeQueryValue(value));
}

function serializeQueryValue(value: unknown): string {
	if (value instanceof Date) {
		return value.toISOString();
	}
	if (value === null) {
		return 'null';
	}
	if (typeof value === 'symbol') {
		return value.toString();
	}
	if (typeof value === 'function') {
		return '[Function]';
	}
	if (isPrimitive(value)) {
		return String(value);
	}
	if (typeof value === 'object') {
		return serializeObjectValue(value);
	}
	return UNSERIALIZABLE_PLACEHOLDER;
}

function isPrimitive(value: unknown): value is string | number | boolean | bigint | undefined {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		typeof value === 'bigint' ||
		value === undefined
	);
}

function serializeObjectValue(value: object): string {
	try {
		return JSON.stringify(value);
	} catch {
		return UNSERIALIZABLE_PLACEHOLDER;
	}
}
