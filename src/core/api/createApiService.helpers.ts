import { adaptError } from '@core/http/errorAdapter';
import type { DomainError } from '@core/http/errorAdapter.types';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import type { ApiResponse, ApiResponseWithMeta } from '@src-types/api';
import type { ZodType } from 'zod';

import type {
	ApiServiceConfig,
	ApiServiceErrorContext,
	ApiServiceExecuteOptions,
	ApiServiceResponseContext,
	ApiServiceResponseMapper,
	ApiServiceSuccess,
} from './createApiService.types';

export interface ValidationIssue {
	path: Array<string | number>;
	message: string;
}

export class ApiResponseValidationError extends Error {
	public readonly issues: ValidationIssue[];

	private constructor(issues: ValidationIssue[]) {
		super('API response validation failed');
		this.name = 'ApiResponseValidationError';
		this.issues = issues;
	}

	static fromZodIssues(
		issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>
	): ApiResponseValidationError {
		const normalized = issues.map(issue => ({
			path: normalizeIssuePath(issue.path),
			message: issue.message,
		}));
		return new ApiResponseValidationError(normalized);
	}
}

export function createMapperContext<TRequest>(
	request: TRequest,
	options?: ApiServiceExecuteOptions
): { request: TRequest; options?: ApiServiceExecuteOptions } {
	return options ? { request, options } : { request };
}

export function createErrorContext<TRequest>(
	request: TRequest,
	options?: ApiServiceExecuteOptions
): ApiServiceErrorContext<TRequest> {
	return options ? { request, options } : { request };
}

export function processSuccessResponse<TRawResponse, TResponse>(params: {
	httpResponse: HttpClientResponse<TRawResponse>;
	responseMapper: ApiServiceResponseMapper<TRawResponse, TResponse>;
	responseSchema?: ZodType<TResponse>;
}): ApiServiceSuccess<TResponse, TRawResponse> {
	const { httpResponse, responseMapper, responseSchema } = params;
	const rawPayload = httpResponse.data;
	const envelope = determineEnvelope(rawPayload);
	const context: ApiServiceResponseContext<TRawResponse> = {
		raw: rawPayload,
		response: httpResponse,
		...(envelope ? { envelope } : {}),
	};

	let transformed = responseMapper(context);
	if (responseSchema) {
		const parsed = responseSchema.safeParse(transformed);
		if (parsed.success) {
			transformed = parsed.data;
		} else {
			throw ApiResponseValidationError.fromZodIssues(parsed.error.issues);
		}
	}

	const success: ApiServiceSuccess<TResponse, TRawResponse> = {
		data: transformed,
		rawData: rawPayload,
		status: httpResponse.status,
		statusText: httpResponse.statusText,
		headers: httpResponse.headers,
		response: httpResponse.response,
		...(envelope?.message === undefined ? {} : { message: envelope.message }),
		...(envelope?.metadata === undefined ? {} : { metadata: envelope.metadata }),
	};

	const apiMeta = extractApiMeta(envelope ?? rawPayload);
	if (apiMeta) {
		success.apiMeta = apiMeta;
	}

	return success;
}

export function handleServiceError<TRequest, TRawResponse, TResponse>(
	error: unknown,
	config: ApiServiceConfig<TRequest, TRawResponse, TResponse>,
	errorContext: ApiServiceErrorContext<TRequest>
): DomainError {
	const applyMapper = config.errorMapper ?? ((domainError: DomainError) => domainError);

	if (error instanceof ApiResponseValidationError) {
		const validationDomainError = createValidationDomainError(
			error.issues,
			extractCustomMessage(config, errorContext)
		);
		return applyMapper(validationDomainError, errorContext);
	}

	const customMessage = extractCustomMessage(config, errorContext);
	const adaptedError = customMessage ? adaptError(error, { customMessage }) : adaptError(error);

	return applyMapper(adaptedError, errorContext);
}

export function defaultResponseMapper<TRawResponse, TResponse>(
	context: ApiServiceResponseContext<TRawResponse>
): TResponse {
	if (context.envelope) {
		return context.envelope.data as TResponse;
	}

	return context.raw as unknown as TResponse;
}

export function determineEnvelope(value: unknown): ApiResponse<unknown> | undefined {
	if (!isRecord(value)) {
		return undefined;
	}
	return 'data' in value ? (value as unknown as ApiResponse<unknown>) : undefined;
}

export function extractApiMeta(value: unknown): ApiResponseWithMeta['apiMeta'] | undefined {
	if (!isRecord(value)) {
		return undefined;
	}

	const metaCandidate = value['apiMeta'];
	if (!isRecord(metaCandidate)) {
		return undefined;
	}

	const result: ApiResponseWithMeta['apiMeta'] = {};
	const { version, requestId, timestamp } = metaCandidate;

	if (typeof version === 'string') {
		result.version = version;
	}
	if (typeof requestId === 'string') {
		result.requestId = requestId;
	}
	if (typeof timestamp === 'string') {
		result.timestamp = timestamp;
	}

	return Object.keys(result).length > 0 ? result : undefined;
}

export function createValidationDomainError(
	issues: ValidationIssue[],
	overrideMessage?: string
): DomainError {
	const validationErrors = issues.map(issue => ({
		field: issue.path.length > 0 ? issue.path.map(String).join('.') : 'root',
		message: issue.message,
	}));

	return {
		type: 'validation',
		message: overrideMessage ?? 'The server returned data in an unexpected format.',
		validationErrors,
		code: 'INVALID_RESPONSE',
	};
}

function extractCustomMessage<TRequest, TRawResponse, TResponse>(
	config: ApiServiceConfig<TRequest, TRawResponse, TResponse>,
	context: ApiServiceErrorContext<TRequest>
): string | undefined {
	return context.options?.errorMessage ?? config.defaultErrorMessage;
}

function normalizeIssuePath(path: ReadonlyArray<PropertyKey>): Array<string | number> {
	return path.map(segment => {
		if (typeof segment === 'string' || typeof segment === 'number') {
			return segment;
		}
		return segment.toString();
	});
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
