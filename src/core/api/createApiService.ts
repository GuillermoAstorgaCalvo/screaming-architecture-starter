import type { HttpPort } from '@core/ports/HttpPort';
import { err, ok } from '@src-types/result';

import {
	createErrorContext,
	createMapperContext,
	defaultResponseMapper,
	handleServiceError,
	processSuccessResponse,
} from './createApiService.helpers.ts';
import { prepareRequest } from './createApiService.request.ts';
import type {
	ApiHttpMethod,
	ApiService,
	ApiServiceConfig,
	ApiServiceExecuteOptions,
} from './createApiService.types';

export { ApiResponseValidationError } from './createApiService.helpers.ts';
export type {
	ApiHttpMethod,
	ApiService,
	ApiServiceConfig,
	ApiServiceErrorContext,
	ApiServiceExecuteOptions,
	ApiServiceRequestConfig,
	ApiServiceResponseContext,
	ApiServiceResponseMapper,
	ApiServiceResult,
	ApiServiceSuccess,
} from './createApiService.types';

export function createApiService<TRequest, TRawResponse = unknown, TResponse = TRawResponse>(
	http: HttpPort,
	config: ApiServiceConfig<TRequest, TRawResponse, TResponse>
): ApiService<TRequest, TResponse, TRawResponse> {
	const method = (config.method ?? 'GET').toUpperCase() as ApiHttpMethod;
	const responseMapper = config.responseMapper ?? defaultResponseMapper<TRawResponse, TResponse>;

	return {
		async execute(request: TRequest, options?: ApiServiceExecuteOptions) {
			const mapperContext = createMapperContext(request, options);
			const requestConfig = config.requestMapper?.(mapperContext) ?? {};
			const preparedRequest = prepareRequest({
				endpoint: config.endpoint,
				request,
				requestConfig,
				method,
				...(config.defaultConfig ? { defaultConfig: config.defaultConfig } : {}),
				...(options ? { options } : {}),
			});

			try {
				const httpResponse = await http.request<TRawResponse>(
					preparedRequest.url,
					preparedRequest.config
				);

				const success = processSuccessResponse({
					httpResponse,
					responseMapper,
					...(config.responseSchema ? { responseSchema: config.responseSchema } : {}),
				});

				return ok(success);
			} catch (error) {
				const errorContext = createErrorContext(request, options);
				const domainError = handleServiceError(error, config, errorContext);

				return err(domainError);
			}
		},
	};
}
