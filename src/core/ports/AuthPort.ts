/**
 * AuthPort - Interface for authentication token management
 *
 * Defines the contract for managing authentication tokens (such as JWT access and
 * refresh tokens) within the hexagonal architecture boundary. Domains and core
 * utilities interact with authentication via this port, allowing infrastructure
 * adapters to provide concrete implementations (e.g., JWT, session cookies).
 *
 * Responsibilities include:
 * - Persisting and retrieving auth tokens
 * - Broadcasting token changes to interested consumers
 * - Decoding token payloads (for JWTs and similar formats)
 * - Determining token validity/expiration
 */

/**
 * Authentication token bundle
 *
 * Optional fields support implementations that provide additional metadata
 * (e.g., refresh token or expiration timestamps).
 */
export interface AuthTokens {
	/**
	 * Primary token used for authenticated requests (e.g., JWT access token)
	 */
	readonly accessToken: string;
	/**
	 * Refresh token, if issued by the backend
	 */
	readonly refreshToken?: string | null;
	/**
	 * Expiration timestamp (milliseconds since UNIX epoch)
	 */
	readonly expiresAt?: number | null;
}

/**
 * Decoded authentication token (e.g., JWT header + payload)
 */
export interface DecodedAuthToken<TPayload = Record<string, unknown>> {
	/**
	 * Token header (algorithm, type, etc.)
	 */
	readonly header: Record<string, unknown>;
	/**
	 * Token payload/body
	 */
	readonly payload: TPayload;
	/**
	 * Token signature (if present)
	 */
	readonly signature?: string | null;
	/**
	 * Issued-at timestamp (seconds since UNIX epoch)
	 */
	readonly issuedAt?: number | null;
	/**
	 * Expiration timestamp (seconds since UNIX epoch)
	 */
	readonly expiresAt?: number | null;
	/**
	 * Not-before timestamp (seconds since UNIX epoch)
	 */
	readonly notBefore?: number | null;
}

/**
 * Listener function invoked when authentication tokens change
 */
export type AuthTokenChangeListener = (tokens: AuthTokens | null) => void;

export interface IsTokenExpiredOptions {
	/**
	 * Allowance (in seconds) for token expiration to account for clock skew
	 * Defaults to 30 seconds if not provided
	 */
	readonly clockSkewSeconds?: number;
}

/**
 * AuthPort contract
 */
export interface AuthPort {
	/**
	 * Retrieve the current token bundle (if available)
	 */
	getTokens(): AuthTokens | null;

	/**
	 * Retrieve the current access token (if available)
	 */
	getAccessToken(): string | null;

	/**
	 * Retrieve the current refresh token (if available)
	 */
	getRefreshToken(): string | null;

	/**
	 * Persist new authentication tokens and notify listeners
	 */
	setTokens(tokens: AuthTokens): void;

	/**
	 * Clear stored authentication tokens and notify listeners
	 */
	clearTokens(): void;

	/**
	 * Subscribe to token change events
	 * Returns an unsubscribe function that removes the listener
	 */
	subscribe(listener: AuthTokenChangeListener): () => void;

	/**
	 * Decode an auth token (e.g., JWT) into header/payload form
	 * @returns Decoded token or null if decoding fails or unsupported
	 */
	decode<TPayload = Record<string, unknown>>(token: string): DecodedAuthToken<TPayload> | null;

	/**
	 * Determine whether a token (or the current access token) is expired
	 */
	isTokenExpired(token?: string | null, options?: IsTokenExpiredOptions): boolean;
}
