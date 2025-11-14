/**
 * Error Adapter Constants
 *
 * HTTP status codes and error messages used for error adaptation.
 */

import i18n from '@core/i18n/i18n';

import type { DomainErrorType } from './errorAdapter.types';

/** HTTP status code constants */
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const HTTP_STATUS_FORBIDDEN = 403;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_CONFLICT = 409;
export const HTTP_STATUS_TOO_MANY_REQUESTS = 429;
export const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;

/** Status code to error type mapping */
export const STATUS_CODE_TO_ERROR_TYPE: Record<number, DomainErrorType> = {
	[HTTP_STATUS_UNAUTHORIZED]: 'authentication',
	[HTTP_STATUS_FORBIDDEN]: 'authorization',
	[HTTP_STATUS_NOT_FOUND]: 'notFound',
	[HTTP_STATUS_CONFLICT]: 'conflict',
	[HTTP_STATUS_TOO_MANY_REQUESTS]: 'rateLimit',
	[HTTP_STATUS_UNPROCESSABLE_ENTITY]: 'validation',
} as const;

/** Error messages - using i18n for translations */
export const ERROR_MESSAGES = {
	get TIMEOUT() {
		return i18n.t('errors.requestTimeout', { ns: 'common' });
	},
	get NETWORK() {
		return i18n.t('errors.networkError', { ns: 'common' });
	},
	get UNKNOWN() {
		return i18n.t('errors.unknownError', { ns: 'common' });
	},
} as const;

/** Client error types (4xx) */
export const CLIENT_ERROR_TYPES: readonly DomainErrorType[] = [
	'clientError',
	'validation',
	'authentication',
	'authorization',
	'notFound',
	'conflict',
	'rateLimit',
] as const;

/** Retryable error types */
export const RETRYABLE_ERROR_TYPES: readonly DomainErrorType[] = [
	'network',
	'timeout',
	'serverError',
	'rateLimit',
] as const;
