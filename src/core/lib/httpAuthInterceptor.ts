import type { RequestInterceptor } from '@core/lib/httpClientInterceptors';
import type { AuthPort, AuthTokens } from '@core/ports/AuthPort';
import type { HttpClientConfig } from '@core/ports/HttpPort';

export interface AuthTokenInterceptorOptions {
	/**
	 * Header name used to attach the auth token (default: Authorization)
	 */
	readonly header?: string;
	/**
	 * Token scheme prefix (default: Bearer). Use null to omit scheme.
	 */
	readonly scheme?: string | null;
	/**
	 * Predicate to determine whether the token should be attached
	 */
	readonly shouldAttach?: (
		config: HttpClientConfig & { url: string },
		tokens: AuthTokens | null
	) => boolean;
	/**
	 * Custom token selector. Defaults to tokens.accessToken.
	 */
	readonly getToken?: (params: {
		auth: AuthPort;
		config: HttpClientConfig & { url: string };
		tokens: AuthTokens | null;
	}) => string | null;
}

/**
 * Create an HTTP request interceptor that injects the auth token
 */
export function createAuthTokenRequestInterceptor(
	auth: AuthPort,
	options: AuthTokenInterceptorOptions = {}
): RequestInterceptor {
	const headerName = (options.header ?? 'Authorization').toLowerCase();
	const scheme = options.scheme === undefined ? 'Bearer' : options.scheme;

	return config => {
		const tokens = auth.getTokens();

		if (typeof options.shouldAttach === 'function' && !options.shouldAttach(config, tokens)) {
			return config;
		}

		const token =
			options.getToken?.({ auth, config, tokens }) ??
			(tokens ? tokens.accessToken : auth.getAccessToken());

		if (!token) {
			return config;
		}

		if (hasHeader(config.headers, headerName)) {
			return config;
		}

		const headers = { ...config.headers };
		headers[resolveHeaderName(headerName)] = scheme ? `${scheme} ${token}` : token;

		return {
			...config,
			headers,
		};
	};
}

function hasHeader(headers: HttpClientConfig['headers'], headerNameLower: string): boolean {
	if (!headers) {
		return false;
	}

	return Object.keys(headers).some(key => key.toLowerCase() === headerNameLower);
}

function resolveHeaderName(headerNameLower: string): string {
	return headerNameLower
		.split('-')
		.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join('-');
}
