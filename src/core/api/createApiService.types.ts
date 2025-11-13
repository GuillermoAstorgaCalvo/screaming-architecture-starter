import type { DomainError } from '@core/http/errorAdapter.types';
import type { HttpClientConfig, HttpClientResponse } from '@core/ports/HttpPort';
import type { ApiRequestOptions, ApiResponse, ApiResponseWithMeta } from '@src-types/api';
import type { Result } from '@src-types/result';
import type { ZodType } from 'zod';

export type ApiHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface ApiServiceExecuteOptions extends ApiRequestOptions {
	readonly signal?: AbortSignal;
	readonly httpConfig?: HttpClientConfig;
	readonly errorMessage?: string;
}

export interface ApiServiceRequestConfig {
	readonly query?: Record<string, unknown>;
	readonly body?: unknown;
	readonly config?: HttpClientConfig;
	readonly path?: string;
}

export interface ApiServiceSuccess<TResponse, TRawResponse = unknown>
	extends ApiResponseWithMeta<TResponse> {
	readonly message?: string;
	readonly metadata?: Record<string, unknown>;
	readonly rawData: TRawResponse;
}

export type ApiServiceResult<TResponse, TRawResponse = unknown> = Result<
	ApiServiceSuccess<TResponse, TRawResponse>,
	DomainError
>;

export interface ApiServiceResponseContext<TRawResponse> {
	readonly raw: TRawResponse;
	readonly response: HttpClientResponse<TRawResponse>;
	readonly envelope?: ApiResponse<unknown>;
}

export type ApiServiceResponseMapper<TRawResponse, TResponse> = (
	context: ApiServiceResponseContext<TRawResponse>
) => TResponse;

export interface ApiServiceErrorContext<TRequest> {
	readonly request: TRequest;
	readonly options?: ApiServiceExecuteOptions;
}

export type ApiServiceErrorMapper<TRequest> = (
	error: DomainError,
	context: ApiServiceErrorContext<TRequest>
) => DomainError;

export interface ApiServiceConfig<TRequest, TRawResponse = unknown, TResponse = TRawResponse> {
	readonly endpoint: string | ((request: TRequest) => string);
	readonly method?: ApiHttpMethod;
	readonly requestMapper?: (context: {
		request: TRequest;
		options?: ApiServiceExecuteOptions;
	}) => ApiServiceRequestConfig | undefined;
	readonly responseMapper?: ApiServiceResponseMapper<TRawResponse, TResponse>;
	readonly responseSchema?: ZodType<TResponse>;
	readonly errorMapper?: ApiServiceErrorMapper<TRequest>;
	readonly defaultErrorMessage?: string;
	readonly defaultConfig?: HttpClientConfig;
}

export interface ApiService<TRequest, TResponse, TRawResponse = TResponse> {
	execute(
		request: TRequest,
		options?: ApiServiceExecuteOptions
	): Promise<ApiServiceResult<TResponse, TRawResponse>>;
}
